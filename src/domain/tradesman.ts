import { ObjectId } from "mongoose"

export default interface Tradesman{
    id?:string,
    _id?:string,
    name:string,
    profile:string,
    idProof:string,
    userId:string | ObjectId,
    experience:number,
    skills:string[],
    location:{
        coordinates:[number,number],
        type:"Point"
    },
    rating?:{
        ratiing:number,
        userId:string
    }
    wage:{
        amount:number,
        type:"Day" | "Hour"
    },
    verificationStatus?:"pending" | "rejected" | "verified",
    isBlocked?:boolean
}