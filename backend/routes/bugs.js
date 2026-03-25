const express = require('express');
const router = express.Router();
const Bug = require('../models/Bug');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/bugs - Get all bugs with filters
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, search, assignedTo } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'developer') {
      query.assignedTo = req.user._id;
    } else if (req.user.role === 'tester') {
      query.reportedBy = req.user._id;
    }

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const bugs = await Bug.find(query).sort({ createdAt: -1 });
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bugs/stats - Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'developer') matchQuery.assignedTo = req.user._id;
    if (req.user.role === 'tester') matchQuery.reportedBy = req.user._id;

    const [total, open, inProgress, resolved, critical, closed] = await Promise.all([
      Bug.countDocuments(matchQuery),
      Bug.countDocuments({ ...matchQuery, status: { $in: ['new', 'assigned'] } }),
      Bug.countDocuments({ ...matchQuery, status: 'in_progress' }),
      Bug.countDocuments({ ...matchQuery, status: 'resolved' }),
      Bug.countDocuments({ ...matchQuery, priority: 'critical' }),
      Bug.countDocuments({ ...matchQuery, status: 'closed' }),
    ]);

    res.json({ total, open, inProgress, resolved, critical, closed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bugs/:id - Get single bug
router.get('/:id', protect, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bugs - Create bug
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, severity, environment, stepsToReproduce, tags } = req.body;

    const bug = await Bug.create({
      title,
      description,
      priority: priority || 'medium',
      severity: severity || 'major',
      reportedBy: req.user._id,
      reportedByName: req.user.name,
      environment,
      stepsToReproduce,
      tags: tags || [],
    });

    res.status(201).json(bug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bugs/:id - Update bug
router.put('/:id', protect, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    const { title, description, priority, severity, status, assignedTo, assignedToName, environment, stepsToReproduce, tags } = req.body;

    if (title) bug.title = title;
    if (description) bug.description = description;
    if (priority) bug.priority = priority;
    if (severity) bug.severity = severity;
    if (status) bug.status = status;
    if (environment !== undefined) bug.environment = environment;
    if (stepsToReproduce !== undefined) bug.stepsToReproduce = stepsToReproduce;
    if (tags) bug.tags = tags;

    // Assign bug (admin only for assignment)
    if (assignedTo !== undefined) {
      bug.assignedTo = assignedTo || null;
      bug.assignedToName = assignedToName || null;
      if (assignedTo && bug.status === 'new') {
        bug.status = 'assigned';
      }
    }

    await bug.save();
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/bugs/:id/comments - Add comment
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    bug.comments.push({
      user: req.user._id,
      userName: req.user.name,
      text: req.body.text,
    });

    await bug.save();
    res.json(bug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bugs/:id - Delete bug (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
