import express from 'express'
import authMiddleware from '../Middlewares/authMiddleware.js'
import { AddQuestion, GetQuestion, UpvoteQuestion } from '../Controllers/questionContollers.js'
import { AddAnswers } from '../Controllers/answerControllers.js'
const router = express.Router()

router.get('/:qid',authMiddleware,GetQuestion)
router.post('/:qid/add-answer',authMiddleware,AddAnswers)
router.post('/:qid/upvote-question',UpvoteQuestion)
router.post('/add-question',authMiddleware,AddQuestion)

export default router