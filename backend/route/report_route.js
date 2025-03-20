import express from 'express';
import multer from 'multer';
import path from 'path';
import { addNewReport, updateReport, getAReport, getAllReport } from '../controller/report_controller.js';
import { verifyTokenAndAuth, verifyTokenAndManager } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        // Force Windows-style path separator
        const windowsSafeName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, windowsSafeName.replace(/\//g, '\\'));
    }
})

const upload = multer({ storage });

router.post("/add_report/:id", verifyTokenAndAuth, upload.fields([
    { name: 'synchronizationFile', maxCount: 1 },
    { name: 'backupFile', maxCount: 1 },
    { name: 'resourceFile', maxCount: 1 }
  ]), addNewReport);
router.patch("/update_report/:id", verifyTokenAndAuth, upload.fields([
    { name: 'synchronizationFile', maxCount: 1 },
    { name: 'backupFile', maxCount: 1 },
    { name: 'resourceFile', maxCount: 1 }
  ]), updateReport);
router.get("/get_A_report/:id", verifyTokenAndAuth, getAReport);
router.get("/get_All_report", verifyTokenAndManager, getAllReport);

export default router;
