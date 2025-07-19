// backend/routes/uploadRoutes.js
import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // The folder where images will be saved
    },
    filename(req, file, cb) {
        // Create a unique filename to prevent overwrites
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! (jpg, jpeg, png)'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// --- The Route ---
// This route expects a single file upload with the field name 'image'
router.post('/', upload.single('image'), (req, res) => {
    // On successful upload, multer adds a 'file' object to the request.
    // We send back the path to the file.
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path.replace(/\\/g, "/")}`, // Format path for web
    });
});

export default router;