import { httpServer } from "./infrastructure/config/app";
import connectDB from "./infrastructure/config/db";
import dotenv from 'dotenv';
dotenv.config();


const startServer = async ()=>{
    try {
        await connectDB()
        const app = httpServer;
        const PORT = process.env.PORT || 8000
        app.listen(PORT,()=>{
            console.log(`connected to server => ${PORT}`);
            
        })
    } catch (error) {
        console.log(error);
    }
}
startServer()