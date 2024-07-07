import {Question} from '../Models/questionModel.js'
import {Answer} from '../Models/answersModel.js'
import { User } from '../models/userModel.js';

const AddAnswers = async (req, res)=>{
    try{
        const userid = req.user._id
        const qid= req.params.qid
        const title = req.body.title
        const description =  req.body.description

        if(!title || !description )
            throw new Error(400 , 'Inadequete Information')

        const date = new Date.now()
        const day = String(date.getDay())
        const month = String(date.getMonth()+1)
        const year = String(date.getFullYear())

        const user = await User.findById(userid)

        const newAnswer = await Answer.create({userid:userid,questionid:qid,username:user.username,title:title,description:description,date:`${day}/${month}/${year}`})
        if(!newAnswer)
            throw new Error("Server Error Occured")
        return res.status(200).json({
            "error":false,
            "message":"Success",
            "newAnswer":newAnswer
        })
    }catch(error){
        return res.status(error.status||500).json({
            "error":true,
            "message":error.message||"Server Error Occured"
        })
    }
}
const DelAnswers = async (req, res)=>{
    try{
        const qid = req.params.qid
        const cid = req.params.cid
        const user = req.user;
        const answerToBeDel = await Answer.deleteOne({userid:user._id , questionid:qid , _id:cid})
        if(!answerToBeDel || answerToBeDel.deletedCount===0)
            throw new Error('Comment could not be deleted')

        res.status(200).json({
            "error":false,
            "message":"Comment Deleted Successfully"
        })
    }catch(error){
        return res.status(error.status||500).json({
            "error":true,
            "message":error.message||"Server error occured"
        })
    }
}

export {GetAnswers , AddAnswers , DelAnswers}