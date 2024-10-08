import multer from 'multer';
import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Convert import.meta.url to a file path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure the 'public' folder exists
// const publicDir = path.join(__dirname, 'public');

// if (!fs.existsSync(publicDir)) {
//     fs.mkdirSync(publicDir);
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix);
//     }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/tmp/uploads';
        fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);// Use original file name
    }
});

const upload = multer({ storage: storage });

export default upload;
