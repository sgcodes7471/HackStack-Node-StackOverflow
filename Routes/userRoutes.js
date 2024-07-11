import express from 'express'
import authMiddleware from '../Middlewares/authMiddleware.js'
import {Login, Logout, Signup ,ForgotPassword,OtpCheck ,ResetPassword, Dashboard, Refresh} from '../Controllers/userController.js'
const router = express.Router()

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/refresh',Refresh)
router.post('/logout',authMiddleware,Logout)
router.get('/dashboard',authMiddleware,Dashboard)
router.post('/forgot-password',ForgotPassword)
router.post('/forgot-password/otp-check',OtpCheck)
router.post('/forgot-password/reset-password',ResetPassword)

export default router