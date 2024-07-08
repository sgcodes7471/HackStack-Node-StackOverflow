import { Otp } from "../Models/otpModel.js"
import { Question } from "../Models/questionModel.js"
import { User } from "../Models/userModel.js"
import { mailUtil,otpGenerator,generateAccessTokenUtils } from "../utils.js"

const Signup = async(req, res)=>{
    try {
        const {username , email , password } = req.body
        
        if(email === undefined || username === undefined || password === undefined)
            throw new Error(400,'all required fields are not sent')
        
        if(password.length < 8)
            throw new Error(400,'Password must have at least 8 characters')
            
        const userExistenceCheck = await User.findOne({$or:[{email:email} , {username:username}]})
        if(!(userExistenceCheck===null) && (userExistenceCheck.email==email || userExistenceCheck.username==username))
            throw new Error(400,'Password must have at least 8 characters')
        const newUser = await User.create({username , email , password})
        if(newUser === null)
            throw new Error(505,'New User not Created due to Server Error' )
        
        mailUtil(email , "Welcome to StackUnderflow!!");
        return res.status(200).json({
            user:newUser,
            "error":false,
            "message":"Succesfully created account. GO LOG IN!!!!"
        })
    } catch (error) {
        return res.status(error.status||500).json({
            "error":true,
            "message":error.message || 'Some Error Occurred'
        })
    }
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
    if(!userExistenceCheck)
        throw new Error(404,'User not found')
       
    const user=userExistenceCheck;
    const passwordCheck=await user.isPasswordCorrect(password)
    if(!passwordCheck){
        mailUtil(user.email , "ALERT!!!Someone tried to Enter in yor StackUnderflow Account with a incorrect or invalid Password!!")
        throw new Error(401,"Incorrect Password")
    }
    const AccessToken = await generateAccessTokenUtils(user._id);
    
    if(!AccessToken)
        throw new Error(501, "Error in Generating Bearer Tokens")
       
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
        "message":"Succesfull Login"
    });
  }catch(error){
    return res.status(error.status || 500).json({
        "error":true,
        "message":error.message || "Some Error Occured"
    })
  }
}
const ForgotPassword = async(req,res)=>{
    try{
        const username = req.body.username;
        const user=await User.findOne({username:username})
        if(!user)
            throw new Error(404,'User not found')
        const clearExpiredOTP = await Otp.deleteMany({expiresIn:{$lte:Date.now()}})
        if(!user.verfied)
            throw new Error(401, "You cannot retrieve your password since your registered email is not verified")
           
        const otp =await otpGenerator(user.email)
        if(otp === false){
            throw new Error
        }
        
        const OTPCheck = await Otp.findOne({userid:user._id})
        if(OTPCheck!==null)
            throw new Error(400 , "Too Early to make another OTP request! You must wait for 15minutes between making two successive OTP requests")
           
        const NewOTP=await Otp.create({userid:user._id , otp:otp , expiresIn:(Date.now()+15*60*1000)})
        mailUtil(user.email , `Your OTP for StackUnderflow account password retrieval otp: ${otp}`)
        return res.status(200).json({
            "error":false,
            "message":`OTP sent to your registered email address`
        })
    }catch(error){
        return res.status(error.status || 501).json({
            "error":true,
            "message":error.message || "Server error occured"
        })
    }
}
const OtpCheck= async(req, res)=>{
    try{
        let username = req.headers['username']
        const otp = req.body.otp
        const user = await User.findOne({username:username})
        if(!otp)
            throw new Error(400 , "OTP not entered")
        const OTPCheck = await Otp.findOne({userid:user._id})
        if(!OTPCheck)
            throw new Error(400 , "OTP request was not made!")
           
        if(OTPCheck.expiresIn <= Date.now()){
            await Otp.deleteOne({userid:user._id})
            throw new Error(401, "OTP request Timed out")
        }
        const OTPVerificationCheck = await OTPCheck.isOTPCorrect(otp)
        if(!OTPVerificationCheck){
            await Otp.deleteOne({userid:user._id})
            throw new Error(401, "Incoorect OTP")
        }
        
        user.verfied = true
        user.pwordChange = true
        user.save({validateBeforSave:false})
        await Otp.deleteOne({userid:user._id})

        return res.status(200).json({
            "error":false,
            "message":"OTP Verification Successfull. Please wait till we redirect you to Reset Password"
        })
    }catch(error){
        return res.status(error.status || 501).json({
            "error":true,
            "message":error.message || "Server Error Occured"
        })
    }
}
const ResetPassword = async(req,res)=>{
    try{
        const username = req.headers['username']
        const newPassword= req.body.newPassword
        const user = await User.findOne({username:username})
        if(!user.pwordChange)
            throw new Error('No eligibility for password reset')
        if(!newPassword)
            throw new Error('No password entered')

        user.password=newPassword
        user.pwordChange=false
        user.save({validateBeforeSave:false})
        mailUtil(user.email , "Your StackUnderflow Password is reset successfully")
        return res.status(200).json({
            "error":false,
            "message":"Password Reset Successfull"
        })
    }catch(error){
        return res.status(501).json({
            "error":true,
            "message":error.message || "Server Error Occured"
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