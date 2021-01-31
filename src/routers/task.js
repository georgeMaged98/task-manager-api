const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const Task = require('../models/task')
const User = require('../models/user')

router.get('/tasks', auth, async (req, res) => {
  try {
    const match = {}
    if (req.query.completed) {
      match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip) * parseInt(req.query.limit),
          sort: sort,
        },
      })
      .execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const validUppdates = ['description', 'completed']
  const isValid = updates.every((update) => validUppdates.includes(update))

  if (!isValid) return res.status(400).send({ error: 'Invalid Updates' })

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) return res.status(404).send()
    updates.forEach((update) => (task[update] = req.body[update]))
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) return res.status(404).send()
    task.remove()
    res.send(task)
  } catch (e) {
    res.send(500).send(e)
  }
})

module.exports = router
