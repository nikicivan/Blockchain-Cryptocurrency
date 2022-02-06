const asyncHandler = require('../middlewares/asyncHandler');
const { blockchain } = require('../index');

// @desc Fetch all blocks
exports.fetchAllBlocks = asyncHandler(async (req, res) => {
  console.log(blockchain);
  res.json(blockchain.chain);
});

// @desc Fetch blocks length
exports.fetchBlocksLength = asyncHandler(async (req, res) => {
  console.log('ovde sam', blockchain);
  res.json(blockchain.chain.length);
});
