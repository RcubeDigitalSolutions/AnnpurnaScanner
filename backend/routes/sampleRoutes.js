const express = require('express');
const router = express.Router();
const Sample = require('../models/sampleModel');

router.get('/', async (req, res) => {
  try {
    const items = await Sample.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new Sample(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
