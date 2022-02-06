const express = require('express');
const {
  fetchAllBlocks,
  fetchBlocksLength,
} = require('../controllers/block.controllers');

const router = express.Router();

router.route('/').get(fetchAllBlocks);

router.route('/length').get(fetchBlocksLength);

module.exports = router;
