import express from 'express';
import { verifyTokenAndAuth, verifyTokenAndManager } from '../middleware/auth.js';
import { deleteDatabase, updateDatabase, getAllDatabases, getDatabaseById, createDatabase } from '../controller/db_controller.js';

const router = express.Router();

router.post("/create_db", verifyTokenAndManager, createDatabase); // Create a new database entry
router.get("/get_a_db/:id", verifyTokenAndAuth, getDatabaseById); // Get a single database by ID
router.get("/get_all_db", getAllDatabases); // Get all databases
router.patch("/update_db/:id", verifyTokenAndManager, updateDatabase); // Update a database entry
router.delete("/delete_db/:id", verifyTokenAndManager, deleteDatabase); // Delete a database entry

export default router;
