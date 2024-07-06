import mongoose, { Schema } from "mongoose";

const viewsSchema = new mongoose.Schema({
    userid:{
        type:String,
        require:true
    },
    questionid:{
        type:String,
        require:true
    }
},{timestamps:true})

export const Views = mongoose.model('Views' , viewsSchema)