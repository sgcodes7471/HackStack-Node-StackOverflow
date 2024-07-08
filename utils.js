import { User } from './Models/userModel.js'
const generateAccessTokenUtils = async (userID)=>{
    try{
        const user = await User.findById(userID)
        const AccessToken = user.generateAccessToken()
        return AccessToken
    }catch(error){
        return false
    }
}


import nodemailer from 'nodemailer';
const otpGenerator = async (userEmail)=>{
    try{
        const user=await User.findOne({email:userEmail})
        const otp = await user.generateOTP();
        return otp
    }catch(error){
        return false
    }
}

const mailUtil = (email , text )=>{
    
   let transporter = nodemailer.createTransport({
    service:'outlook',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
    })
    let mailInfo = {
    from:process.env.EMAIL, 
    to:email,
    text:text
    }
    transporter.sendMail(mailInfo , (error , info)=>{
    if(!info){
        console.log(error)
    }else{
        console.log(info)
    }
    })
}

export {generateAccessTokenUtils , otpGenerator , mailUtil}