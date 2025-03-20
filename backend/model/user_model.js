import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
      firstName: {
        type: String,
        required: [true, "name must be provided"],
      },
      lastName: {
        type: String,
        required: [true, "name must be provided"],
      },
      user_id:{
           type:Number ,
           required: [true , "User id must be provided"]
      },
      mail: {
        type: String,
        required: [true, "mail must be provided"],
  
        match: [/^[\w.-]+@bankofabyssinia\.com$/, "please provide valid mail"],
        unique: true,
      },
     role: {
        type: String,
        required: [true, "role must be provided"],
        enum: ["staff", "manager"],
        default: "staff",
      },
      password: {
        type: String,
        required: [true, "password must be provided"],
      },
}, { timestamps: true });



UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  };
  
  UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userID: this._id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
  };

export default mongoose.model("User", UserSchema);