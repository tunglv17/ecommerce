import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { storage } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import multer from "multer";
import formidable from "formidable";
const upload = multer({ storage: multer.memoryStorage() });
const create = (req: any, res: Response, next: NextFunction) => {
  const form: any = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json(err.message);
    }
    if (files.files) {
      if (files.files.size > 100000) {
        return res
          .status(400)
          .json({ message: "You should upload photos under 10mb!" });
      }

      const storageRef = ref(storage, `files/${files.files.originalFilename}`);

      const uploadTask = uploadBytesResumable(
        storageRef,
        fs.readFileSync(files.files.filepath),
        {
          contentType: files.files.mimetype,
        }
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          res.status(500).json(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            return res.status(200).json(downloadURL);
          });
        }
      );
    }
  });
};

export { create, upload };
