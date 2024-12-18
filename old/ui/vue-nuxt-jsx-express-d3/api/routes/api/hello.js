const { Router } = require('express');

const router = Router();

// @route -- GET api/hello
// @desc -- return 'Hello!'
// @access -- public

router.get('/', (req, res) => {
  res.json({ data: 'Hello!', error: null });
});

module.exports = router;
