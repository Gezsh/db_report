import { deleteUser, getAllUsers, getAUser, login,register, updateUser } from "../controller/user_controller.js";
import express from 'express'
import { verifyTokenAndAuth, verifyTokenAndManager } from "../middleware/auth.js";

const router=express.Router()


router.post('/register',register)
router.post("/login",login)

router.get("/get_All_user", verifyTokenAndManager, getAllUsers);
router.get("/get_A_user/:id", verifyTokenAndAuth, getAUser);
router.patch("/update_user/:id", verifyTokenAndAuth, updateUser);
router.delete("/delete_user/:id", verifyTokenAndAuth, deleteUser);
export default router
