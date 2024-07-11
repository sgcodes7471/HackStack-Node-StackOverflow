import {Answer} from '../Models/answersModel.js'
import { User } from '../Models/userModel.js'
import { Upvote } from '../Models/upvoteModel.js'

const AddAnswers = async (req, res)=>{
    try{
        const userid = req.user._id
        const qid= req.params.qid
        const answer = req.body.answer
        if(!answer )
            throw new Error(400 , 'Inadequete Information')

        const date = new Date()
        const day = String(date.getDate())
        const month = String(date.getMonth()+1)
        const year = String(date.getFullYear())

        const user = await User.findById(userid)

        const newAnswer = await Answer.create({userid:userid,questionid:qid,username:user.username,answer:answer,date:`${day}/${month}/${year}`})
        if(!newAnswer)
            throw new Error("Server Error Occured")
        return res.status(200)
        .redirect(`/api/user/${qid}`)
        // .json({
        //     "error":false,
        //     "message":"Success",
        //     "newAnswer":newAnswer
        // })
    }catch(error){
        return res.status(error.status||500).render('error',{
            "error":true,
            "message":error.message||"Server Error Occured"
        })
    }
}
const DelAnswers = async (req, res)=>{
    try{
        const cid = req.params.cid
        const user = req.user;
        const answerToBeDel = await Answer.deleteOne({userid:user._id  , _id:cid})
        if(!answerToBeDel || answerToBeDel.deletedCount===0)
            throw new Error('Answer could not be deleted')
        await Upvote.deleteMany({entityid:cid})

        res.status(200)
        .redirect('/api/profile/')
        .json({
            "error":false,
            "message":"Answer Deleted Successfully"
        })
    }catch(error){
        return res.status(error.status||500).json({
            "error":true,
            "message":error.message||"Server error occured"
        })
    }
}
const UpvoteAnswer = async (req, res)=>{
    try{
        const userid=req.user._id
        const answerid =  req.params.cid
        const UpvoteCheck = await Upvote.findOne({userid:userid , entityid:answerid})
        if(UpvoteCheck!== null){
            const DownVote = await Upvote.findByIdAndDelete(UpvoteCheck._id)
            if(!DownVote)
                throw new Error(500 , "UpVote not removed due to technical error")

            const answer = await Answer.findById(answerid)
            const currentUpvotes = answer.upvote - 1;
            answer.upvote = currentUpvotes
            const newUpvoteCount = await answer.save({validateBeforeSave:false})
            await Upvote.findOneAndDelete({userid:userid , entityid:answerid})
            return res.status(200)
            .redirect(`/api/question/${req.params.qid}`)
            // .json({
            //     "error":false,
            //     "message":"UpVote Removed Successfully",
            //     "newUpvotes":newUpvoteCount.upvote
            // })
        }
        const newUpVote= await Upvote.create({userid:userid , entityid:answerid})
        if(!newUpVote){
            throw new Error(500 , "Question UpVote unsuccessfull")
        }
        const answer = await Answer.findById(answerid)
        const currentUpvotes = answer.upvote +1;
        answer.upvote = currentUpvotes
        const newUpvoteCount = await answer.save({validateBeforeSave:false})
        return res.status(200)
        .redirect(`/api/question/${req.params.qid}`)
        // .json({
        //     "error":false,
        //     "message":"Answer Upvoted Successfully",
        //     "newUpvotes":newUpvoteCount.upvote
        // })
    }catch(error){
        return res.status(error.status || 500).render('error',{
            "error":true,
            "message":error.messaga || 'server error occured'
        })
    }
}

export { AddAnswers , DelAnswers , UpvoteAnswer}