import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        userid:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        date:{
            type:Number,
            required:true
        },
        upvote:{
            type:Number,
            required:true
        },
        views:{
            type:Number
        }
    },{
        timestamps:true
    }
)

export const Question = mongoose.model("Question" , questionSchema);