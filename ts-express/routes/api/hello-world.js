"use strict";
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    try {
        return res.status(200).json({ message: "Hello world!" });
    }
    catch (err) {
        return res.status(500).json({ message: "Error while handling request" });
    }
});
module.exports = router;
//# sourceMappingURL=hello-world.js.map