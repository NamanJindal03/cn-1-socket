import mongoose from "mongoose";

const url = "mongodb://localhost:27017/chat-it-up"
let retry = 1;

export const connectionToMongo = async function(){
    try{
        return await mongoose.connect(url)
    }
    catch(err){
        if(retry) {
            console.log('some error occured');
            console.log('retrying........');
            retry--;
            return await connectionToMongo()
        }
        throw new Error(err)
    }
}