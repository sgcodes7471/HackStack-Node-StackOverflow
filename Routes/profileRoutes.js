import express from 'express'
import authMiddleware from '../Middlewares/authMiddleware.js'
import {GetEmailVerfiy, PostEmailVerify,Profile} from '../Controllers/profileController.js'
import { DelQuestion } from '../Controllers/questionContollers.js'
import { DelAnswers } from '../Controllers/answerControllers.js'
const router = express.Router()

router.get('/',authMiddleware,Profile)
router.get('/email-verify',authMiddleware,GetEmailVerfiy)
router.post('/email-verify',authMiddleware,PostEmailVerify)
router.delete('/:qid/del-question',authMiddleware,DelQuestion)
router.delete('/:qid/del-answer/:cid',authMiddleware,DelAnswers)

export default router