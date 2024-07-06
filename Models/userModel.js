import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            lowercase:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        verfied:{
            type:Boolean
        }
    },{
        timestamps:true
    }
)

//do not use a arrow function here as this is involved
userSchema.pre("save", async function(next){
    try{
        if(!(this.isModified("password")))
            return next();
        this.password=await bcrypt.hash(this.password, 10);
        next()
    }
    catch(error){
        console.log("Errorr in hashing password\n" , error)
        return false
    }
} )

userSchema.methods.isPasswordCorrect = async function(password){
   try{
    return await bcrypt.compare(password, this.password)
   }catch(error){
    console.log('Error in Comparing using bcrypt')
    return false
   }
}

userSchema.methods.generateAccessToken=function(){
 try{
    return  jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }catch(error){
    console.log("Error in Signing of Access Token")
    throw error;
 }
}

userSchema.methods.generateOTP = function (){
    try{
        const otp = parseInt(crypto.randomBytes(4).toString('hex').slice( 0 , 4) , 16).toString().slice(0 , 4)
        console.log(otp)
        return otp;
        
    }catch(error){
        console.log("Error is generating OTP")
        throw error
    }
}

export const User=mongoose.model("User"  , userSchema);