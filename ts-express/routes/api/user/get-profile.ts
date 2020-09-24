// imports
import express = require("express");
import auth = require("../../../middleware/auth");
const router = express.Router();

// @route -- POST /api/user/get-profile
// @desc -- get id from req.body.authState, return user
// @access -- protected

router.post(
  "/",
  auth, // use auth middleware
  (req: express.Request, res: express.Response) => {
    const { authState } = req.body;
    try {
      const { id } = authState;
      const user: object = { name: "Kakashi", id }; // pretend db Response
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Error while fetching user" });
    }
  }
);
export = router;
