import { Question } from "../Models/questionModel.js"
import { Upvote } from "../Models/upvoteModel.js"
import { Answer } from "../Models/answersModel.js"
import { Views } from "../Models/viewsModel.js"

const GetQuestion = async(req, res)=>{
    try{
        const userid = req.user._id
        const qid = req.params.qid
        const question = await Question.findById(qid)
        if(!question)
            throw new Error(400,'Question not found')
        const answers = await Answer.find({questionid:qid}).sort({createdAt : -1}).exec()

        const viewCheck = await Views.findOne({userid:userid , questionid:qid})
        const isViewed = (!viewCheck)?false:true
        const upvoteCheck = await Upvote.findOne({userid:userid , entityid:qid})
        const isUpvoted = (!upvoteCheck)?false:true

        return res.status(201).json({
            "error":false,
            "question":question,
            "answer":answers,
            "isUpvoted":isUpvoted,
            "isViewed":isViewed,
            "message":'Success'
        })
    }catch(error){
        return res.status(error.status || 500).json({
            "error":true,
            "mesaage":error.mesaage || 'Some Error Occured'
        })
    }
}
const AddQuestion = async (req, res)=>{
    try{
        const user = req.user
        const title = req.body.title
        const description = req.body.description

        if(!title || !description || !date)
            throw new Error(400,'All details are not filled')

        const date = new Date.now()
        const day = String(date.getDate())
        const month = String(date.getMonth()+1)
        const year = String(date.getFullYear())

        const newQuestion = await Question.create({userid:user._id,username:user.username,title,description,date:`${day}/${month}/${year}`,upvote:0,views:0})
        if(!newQuestion)
            throw new Error(501,'Question could be added')
        return res.status(200).json({
            "error":false,
            "message":'Successfully added'
        })
    }catch(error){
        return res.status(error.status || 500).json({
            "error":true,
            "message":error.message || 'Server Error occured'
        })
    }
}
const UpvoteQuestion = async (req, res)=>{
    try{
        const userid=req.user._id
        const questionid=req.params.qid
        const UpvoteCheck = await Upvote.findOne({userid:userid , entityid:questionid})
        if(UpvoteCheck!== null){
            const DownVote = await Upvote.findByIdAndDelete(UpvoteCheck._id)
            if(!DownVote){
                throw new Error(500 , "UpVote not removed due to technical error")
            }
            const question = await Question.findById(questionid)
            const currentUpvotes = question.upvote - 1;
            question.upvote = currentUpvotes
            const newUpvoteCount = await question.save({validateBeforeSave:false})
            await Upvote.findOneAndDelete({userid:userid , entityid:questionid})
            return res.status(200).json({
                "error":false,
                "message":"UpVote Removed Successfully",
                "data":newUpvoteCount.upvote
            })
        }
        const newUpVote= await Upvote.create({userid:userid , entityid:questionid})
        if(!newUpVote){
            throw new Error(500 , "Question UpVote unsuccessfull")
        }
        const question = await Question.findById(questionid)
        const currentUpvotes = question.upvote +1;
        question.upvote = currentUpvotes
        const newUpvoteCount = await question.save({validateBeforeSave:false})
        return res.status(200).json({
            "error":false,
            "message":"Question Upvoted Successfully",
            "data":newUpvoteCount.upvote
        })
    }catch(error){
        return res.status(500).json({
            "error":true,
            "message":"Server Error Occured",
            "data":null
        })
    }
}
const DelQuestion = async (req, res)=>{
    try{
        const qid = req.params.qid
        const userid = req.user._id;
        const questionToBeDel = await Question.deleteOne({userid:userid , _id:qid})
        if(!questionToBeDel || questionToBeDel.deletedCount===0){
            throw new Error(500,'Question could not be deleted')
        }
        res.status(200).json({
            "error":false,
            "message":"Question Deleted Successfully"
        })
    }catch(error){
        return res.status(error.status || 500).json({
            "error":true,
            "message":error.mesaage || 'Server error occured'
        })
    }
}

export {GetQuestion , AddQuestion , UpvoteQuestion , DelQuestion}