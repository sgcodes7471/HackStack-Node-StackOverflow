import express from 'express'
import authMiddleware from '../Middlewares/authMiddleware.js'
import { AddQuestion, GetQuestion, UpvoteQuestion } from '../Controllers/questionContollers.js'
import { AddAnswers, UpvoteAnswer } from '../Controllers/answerControllers.js'
const router = express.Router()

router.get('/:qid',authMiddleware,GetQuestion)
router.post('/add-question',authMiddleware,AddQuestion)
router.post('/:qid/upvote-question',authMiddleware,UpvoteQuestion)
router.post('/:qid/add-answer',authMiddleware,AddAnswers)
router.post('/:qid/upvote-answer/:cid',authMiddleware,UpvoteAnswer)

export default router