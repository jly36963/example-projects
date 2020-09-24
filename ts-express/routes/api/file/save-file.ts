// imports
import express = require("express");
const router = express.Router();

// multer
import multer = require("multer");
const upload = multer();

// @route -- POST /api/file/save-file
// @desc -- get file from multi-part form request
// @access -- public

interface MulterRequest extends express.Request {
  file: Express.Multer.File;
}

// fieldname -- form field name (argument for upload.single())
// originalname -- file name
// buffer -- data (bytes)

router.post(
  "/",
  upload.single("file"),
  (req: MulterRequest, res: express.Response) => {
    const { file } = req;
    const fn: string = file.originalname;
    console.log(fn);
    try {
      return res.status(200).json({ fn });
    } catch (err) {
      return res.status(500).json({ message: "Error uploading file." });
    }
  }
);
export = router;
