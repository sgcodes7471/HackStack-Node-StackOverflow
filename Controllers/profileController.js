import { Answer } from "../Models/answersModel.js"
import { Otp } from "../Models/otpModel.js"
import { Question } from "../Models/questionModel.js"
import { User } from "../models/userModel.js"
import { mailUtil,otpGenerator,generateAccessTokenUtils } from "../utils.js"

const Profile = async (req, res)=>{
    try{
        const userid=req.user._id
        const user=await User.findById(userid)
        if(!user)
            throw new Error(400,'No user found!')
        const questions = await Question.find({userid:userid}).sort({ createdAt: -1 }).exec()
        const answers = await Answer.find({userid:userid}).sort({ createdAt: -1 }).populate('questionid').exec()
        
        return res.status(200).json({
            "error":false,
            "user":user,
            "questions":questions,
            "answers":answers,
            "message":'Success'
        })
        
    }catch(error){
       return res.status(error.status||500).json({
            "error":true,
            "message":error.message || 'Server Error Occured'
        })
    }
}
const GetEmailVerfiy = async(req, res)=>{
    try{
        let user = req.user
        user = await User.findById(user._id)
        if(user.verfied){
            return res.status(401).json({
                "error":true,
                "message":"User is Already Verified"
            })
        }
        await Otp.deleteMany({expiresIn:{$lte:Date.now()}})
        const otp =await otpGenerator(user.email)
        if(otp === false)
            throw new Error('otp not generated')
                
        const OTPCheck = await Otp.findOne({userid:user._id})
        if(OTPCheck!==null){
            return res.status(404).json({
                "error":true,
                "message":"Too Early to make another OTP request! You must wait for 15minutes between making two successive OTP requests"
            })
        }
        const NewOTP=await Otp.create({userid:user._id , otp:otp , expiresIn:(Date.now()+15*60*1000)})
        mailUtil(user.email , `Your OTP for StackUnderflow account id ${otp}`)
        return res.status(200).json({
            "error":false,
            "message":"OTP sent to your Registered Email Id. Do not make furthur OTP request for 15minutes",
        })
        
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Could Not generate and send OTP"
        })
    }
}
const PostEmailVerify = async(req, res)=>{
    try{
        let user = req.user
        const otp = req.body.otp;
        user = await User.findById(user._id)
        
        if(!otp){
            return res.status(400).json({
                "error":true,
                "message":"OTP not entered"
            })
        }
        
        const OTPCheck = await Otp.findOne({userid:user._id})
        if(!OTPCheck){
            return res.status(400).json({
                "error":true,
                "message":"OTP request was not made!"
            })
        }
        
        if(OTPCheck.expiresIn <= Date.now()){
            await Otp.deleteOne({userid:user._id})
            return res.status(400).json({
                "error":true,
                "message":"OTP request Timed out"
            })
        }
        
        const OTPVerificationCheck = await Otp.isOTPCorrect(otp)
        if(!OTPVerificationCheck){
            await Otp.deleteOne({userid:user._id})
            return res.status(401).json({
                "error":true,
                "message":"OTP Incorrect"
            })
        }
        
        user.verfied = true;
        user.save({validateBeforSave:false})
        await Otp.deleteOne({userid:user._id})
        return res.status(200).json({
            "error":false,
            "message":"Email Verification Successfull"
        })
    }catch(error){
        return res.status(501).json({
            "error":true,
            "message":"Server Error Occured"
        })
    }
}

export {Profile , GetEmailVerfiy , PostEmailVerify}