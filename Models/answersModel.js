import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        userid:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        questionid:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        },
        upvote:{
            type:Number,
            required:true
        },
        date:{
            type:Number,
            required:true
        }
    },{
        timestamps:true
    }
)

export const Answer = mongoose.model("Answer" , answerSchema);