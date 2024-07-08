import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const otpSchema=new mongoose.Schema({
    userid:{
        type:String , 
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresIn:{
        type:Number , 
        required:true
    }
},{
    timestamps:true
})

otpSchema.pre("save" , async function(next){
    if(!(this.isModified("otp")))
        return next()
    this.otp = await bcrypt.hash(this.otp, 2)
    next()
})
otpSchema.methods.isOTPCorrect = async function(otp){
    try{
        return await bcrypt.compare(otp, this.otp)
       }catch(error){
        console.log('Error in Comparing using bcrypt')
        return false
       }
}

export const Otp = mongoose.model('Otp' , otpSchema)