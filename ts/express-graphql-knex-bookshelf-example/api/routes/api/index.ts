// imports
import express from "express";
const router = express.Router();

/** GET /api,  Return 200 OK */
router.get("/", (_req: express.Request, res: express.Response) => {
  return res.sendStatus(200);
});

export default router;
