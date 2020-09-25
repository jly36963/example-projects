import express from 'express';
const router = express.Router();

// @route -- GET /api/
// @desc -- return 'Hello World'
// @access -- public

router.get('/', (req: express.Request, res: express.Response) => {
  return res.status(200).json({
    message: 'Hello World!',
  });
});

export default router;
