// imports
import express = require("express");
const router = express.Router();

// multer
import multer = require("multer");
const upload = multer();

// @route -- POST /api/file/save-files
// @desc -- get files from multi-part form request
// @access -- public

// fieldname -- form field name (argument for upload.single())
// originalname -- file name
// buffer -- data (bytes)

// ***
// use "for ... in ..." loop if doing async stuff (fs, s3, etc)
// promises/async not supported in forEach, map, etc
// ***

// for (const file of files) {
//   fileNames.push(file.originalname);
// }

interface MulterRequest extends express.Request {
  files: Array<Express.Multer.File>;
}

router.post(
  "/",
  upload.array("files", 10),
  (req: MulterRequest, res: express.Response) => {
    const files: Array<Express.Multer.File> = req.files;
    const fileNames: Array<String> = [];
    files.forEach((file: Express.Multer.File) => {
      fileNames.push(file.originalname);
    });

    try {
      return res.status(200).json({ fileNames });
    } catch (err) {
      return res.status(500).json({ message: "Error while uploading files." });
    }
  }
);
export = router;
