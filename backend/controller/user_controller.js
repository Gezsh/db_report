import BadRequestError from '../error/Badrequest.js';
import User from '../model/user_model.js'
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const login = async (req, res, next) => {
    try {
      const { mail, password } = req.body;
      if (!mail || !password) {
        return res.status(400).json({ message: "Invalid mail or password" });
      }
  
      const user = await User.findOne({ mail });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      const token = user.createJWT();
      user.password = undefined;
  
     res.cookie("token", token, { 
    httpOnly: true,
    secure: true,        // ✅ very important on HTTPS!
    sameSite: 'none'     // ✅ allows sending cookies cross-origin
});
  
      res.status(200).json({ data: user, token });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    res.status(200).json({ user: user });
  };



  const updateUser = async (req, res) => {
    let newPassword;
    const { id } = req.params;
    console.log(req.user);
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(req.body.password, salt);
      // if (!this.isModified("password")) return next();
    }
    const user = await User.findByIdAndUpdate(
      id,
      { ...req.body, password: newPassword },
      { new: true }
    );
    res
      .status(StatusCodes.OK)
      .json({ user: user, message: "updated successfully" });
  };
  
  const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.status(StatusCodes.OK).json(users);
  };
  



  const getAUser = async (req, res) => {
    const { id } = req.params;
  
    console.log("Requested User ID:", id); // Debugging log
  
    // Validate ID format before querying MongoDB
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID received:", id);
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    try {
      const user = await User.findById(id).lean(); // 🔥 Use `.lean()` to return plain JSON
  
      if (!user) {
        console.log("User not found for ID:", id);
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Fetched User:", user); // Debugging log
  
      delete user.password; // Remove sensitive data
  
      return res.status(200).json({ success: true, data: user }); // 🔥 Ensure the response is formatted correctly
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  const deleteUser = async (req, res) => {
    const { id } = req.params;
    const users = await User.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ message: "deleted successfully" });
  };


export {login , register ,deleteUser,getAUser,getAllUsers,updateUser}



