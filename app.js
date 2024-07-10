import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
    path:path.resolve(__dirname , '.env')
})

import userRoutes from './Routes/userRoutes.js'
import profileRoutes from './Routes/profileRoutes.js'
import questionRoutes from './Routes/questionRoutes.js'

const app = express()
app.use(express.json())

app.use(cookieParser())
app.set('view engine'  , 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname , 'public')))

app.get('/api/user/signup',(req, res)=>{
    res.render('signup')
})
app.get('/api/user/login',(req, res)=>{
    res.render('login')
})
app.get('/api/user/forgot-password',(req, res)=>{
    res.render('forgotPassword')
})
app.get('/api/user/forgot-password/otp-check',(req, res)=>{
    res.render('otp')
})
app.get('/api/user/forgot-password/reset-password',(req, res)=>{
    res.render('resetPassword')
})

app.use('/api/user' , userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/question' , questionRoutes)

app.use((req,res)=>{
    res.status(404).render('error')
})

export default app