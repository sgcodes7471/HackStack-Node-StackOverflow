import { Answer } from "../Models/answersModel.js"
import { Otp } from "../Models/otpModel.js"
import { Question } from "../Models/questionModel.js"
import { User } from "../models/userModel.js"
import { mailUtil,otpGenerator,generateAccessTokenUtils } from "../utils.js"

const Signup = async(req, res)=>{
    const {username , email , password } = req.body
    
    if(email === undefined || username === undefined || password === undefined){
        return res.status(400).json({
            "error":true,
            "message":"all required fields are not sent"
        })
    }
    
    if(password.length < 8){
        return res.status(400).json({
            "error":true,
            "message":"Password must have at least 8 characters"
        })
    }
    
    const userExistenceCheck = await User.findOne({$or:[{email:email} , {username:username}]})
    if(!(userExistenceCheck===null) && (userExistenceCheck.email==email || userExistenceCheck.username==username)){
        return res.status(400).json({
            "error":true,
            "message":"User with same Email or username already exist! Choose a different one"
        })
    }
    const newUser = await User.create({username , email , password})
    if(newUser === null){
        return res.status(505).json({
            "error":true,
            "message":"New User not Created due to Server Error"
        })
    }
    
    mailUtil(email , "Welcome to StackUnderflow!!");
    return res.status(200).json({
        user:newUser,
        "error_status":false,
        "message":"Succesfully created account. GO LOG IN!!!!"
    })
}
const Logout = async(req, res)=>{
    try{
        let user = req.user;
        user=await User.findById(user._id)
        await user.save({validateBeforSave:false})
        const options ={
            httpOnly:true,
            secure:process.env.DEV_STATE === 'production'
        }
        
            return  res.status(200).clearCookie('AccessToken' , options)
            .json({
                "error":false,
                "message":"User Logged Out Successfully"
            })
        }catch(error){
            return  res.status(500).json({
                "error":true,
                "message":"Error in Server while logging Out the user"
            })
        }
}
const Login = async(req, res)=>{
    const username=req.body.username;
    const password=req.body.password;
  try{
    const userExistenceCheck=await User.findOne( {username:username} );
    if(!userExistenceCheck){
        return  res.status(400).json({
            "loggedInUser":null,
            "error":true,
            "message":"User Does not Exist!! Give a Valid Username"
        })
    }
    const user=userExistenceCheck;
    const passwordCheck=await user.isPasswordCorrect(password)
    if(!passwordCheck){
        mailUtil(user.email , "ALERT!!!Someone tried to Enter in yor StackUnderflow Account with a incorrect or invalid Password!!")
        return  res.status(400).json({
            "loggedInUser":null,
            "error":true,
            "message":"Incorrect Password"
        })
    }
    const AccessToken = await generateAccessTokenUtils(user._id);
    
    if(!AccessToken){
        return res.status(501).json({
            user:null,
            "error":true,
            "message":"Error in Generating Bearer Tokens"
        })
    }
    
   
    const loggedInUser=await User.findById(user._id).select(" -password ")
    const options={
        httpOnly:true,
        secure:process.env.DEV_STATE === 'production'
    }
    loggedInUser.save({validateBeforeSave:false})
    return res.status(200).cookie("AccessToken", AccessToken, options).
    json({
        "error":false,
        "loggedInUser":loggedInUser, 
        "AccessToken":AccessToken , 
        "message":"Succesfull Login"
    });
  }catch(error){
    return res.status(500).json({
        "error":true,
        "message":"Some Error Occured"
    })
  }
}
const ForgotPassword = async(req,res)=>{
    try{
        const username = req.body.username;
        const user=await User.findOne({username:username})
        if(!user){
            return res.status(400).json({
                "error":true,
                "message":"username does not exist"
            })
        }
        const clearExpiredOTP = await Otp.deleteMany({expiresIn:{$lte:Date.now()}})
        if(!user.verfied){
            return res.status(401).json({
                "error":true,
                "message":"You cannot retrieve your password since your registered email is not verified"
            })
        }
        
        const otp =await otpGenerator(user.email)
        if(otp === false){
            throw new Error
        }
        
        const OTPCheck = await Otp.findOne({userId:user._id})
        if(OTPCheck!==null){
            return res.status(404).json({
                "error":true,
                "message":"Too Early to make another OTP request! You must wait for 15minutes between making two successive OTP requests"
            })
        }
        const NewOTP=await Otp.create({userId:user._id , otp:otp , expiresIn:(Date.now()+15*60*1000)})
        mailUtil(user.email , `Your OTP for StackUnderflow account password retrieval id ${otp}`)
        return res.status(200).json({
            "error":false,
            "message":`OTP sent to your registered email address`
        })
    }catch(error){
        return res.status(501).json({
            "error":true,
            "message":"Server error occured"
        })
    }
}
const OtpCheck= async(req, res)=>{
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
        
        const OTPCheck = await Otp.findOne({userId:user._id})
        if(!OTPCheck){
            return res.status(400).json({
                "error":true,
                "message":"OTP request was not made!"
            })
        }
        
        if(OTPCheck.expiresIn <= Date.now()){
            await Otp.deleteOne({userId:user._id})
            return res.status(400).json({
                "error":true,
                "message":"OTP request Timed out"
            })
        }
        
        const OTPVerificationCheck = await Otp.isOTPCorrect(otp)
        if(!OTPVerificationCheck){
            await Otp.deleteOne({userId:user._id})
            return res.status(401).json({
                "error":true,
                "message":"OTP Incorrect"
            })
        }
        
        user.verfied = true;
        user.save({validateBeforSave:false})
        await Otp.deleteOne({userId:user._id})
        return res.status(200).json({
            "error":false,
            "message":"OTP Verification Successfull. Please wait till we redirect you to Reset Password"
        })
    }catch(error){
        return res.status(501).json({
            "error":true,
            "message":"Server Error Occured"
        })
    }
}
const ResetPassword = async(req,res)=>{
    try{
        const userid = req.user._id
        const newPassword= req.body.newPassword
        const otp = req.body.otp;
        const user = await User.findById(userid)
        
        if(!otp){
            return res.status(400).json({
                "error":true,
                "message":"OTP not entered"
            })
        }
        
        const OTPCheck = await Otp.findOne({userId:user._id})
        if(!OTPCheck){
            return res.status(400).json({
                "error":true,
                "message":"OTP request was not made!"
            })
        }
        
        if(OTPCheck.expiresIn <= Date.now()){
            await OTPVerify.deleteOne({userId:user._id})
            return res.status(400).json({
                "error":true,
                "message":"OTP request Timed out"
            })
        }
        
        const OTPVerificationCheck = await Otp.isOTPCorrect(otp)
        if(!OTPVerificationCheck){
            await OTPVerify.deleteOne({userId:user._id})
            return res.status(401).json({
                "error":true,
                "message":"OTP Incorrect"
            })
        }
        
        await Otp.deleteOne({userId:user._id})
        user.password=newPassword
        user.save({validateBeforeSave:false})
        mailUtil(user.email , "Your StackUnderflow Password is reset successfully")
        return res.status(200).json({
            "error":false,
            "message":"Password Reset Successfull"
        })
    }catch(error){
        return res.status(501).json({
            "error":true,
            "message":"Server Error Occured"
        })
    }
}
const Dashboard = async(req, res)=>{
    try{
        const questions = await Question.find().sort({createdAt:-1}).exec()
        return res.status(201).json({
            "error":false,
            "questions":questions,
            "message":'Success'
        })
    }catch(error){
        return res.status(error.status || 500).json({
            "error":true,
            "message":error.status || 'Server Error Occured'
        })
    }
}

export {Login , Signup , Logout ,ForgotPassword, Dashboard, OtpCheck ,ResetPassword}