// imports
import express = require("express");
const router = express.Router();

// @route -- POST /api/user/get-post/:id
// @desc -- return post
// @access -- public

router.get("/:id", (req: express.Request, res: express.Response) => {
  const id = req.params;

  try {
    const post: object = { message: "Hello there!", author: "Kakashi", id }; // pretend db Response
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Error while fetching post" });
  }
});
export = router;
