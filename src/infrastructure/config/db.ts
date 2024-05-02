import mongoose from "mongoose";

const DB_STRING = process.env.MONGO_URI || ''

const connectDB = async ()=>{
    try {
        await mongoose.connect(DB_STRING)
        console.log('Successfully connected to database');
        
    }catch(error:any){
        console.log(error.message)
        setTimeout(connectDB,5000)
    }
}

export default connectDB