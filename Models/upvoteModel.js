import mongoose from "mongoose";

const upvoteSchema = new mongoose.Schema(
    {
        userid:{
            type:String,
            required:true
        },
        entityid:{
            type:String,
            required:true
        }
    },{
        timestamps:true
    }
)

export const Upvote = mongoose.model("Upvote" , upvoteSchema);