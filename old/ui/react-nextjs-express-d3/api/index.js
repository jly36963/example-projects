const express = require('express');
const router = express.Router();

// @route -- GET /api/
// @desc -- return 'Hello World'
// @access -- public

router.get('/', (req, res) => {
  return res.status(200).json({
    data: 'Hello World',
    error: null,
  });
});

module.exports = router;
