import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
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

app.get('/',(req,res)=>{
    res.send('Hello')
})

app.use('/api/user' , userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/question' , questionRoutes)

export default app