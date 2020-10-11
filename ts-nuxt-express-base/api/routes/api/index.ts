import express from 'express';
const router = express.Router();

// @route -- GET api/hello
// @desc -- return 'Hello World!'
// @access -- public

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

export default router;
