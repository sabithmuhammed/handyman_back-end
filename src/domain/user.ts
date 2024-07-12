export default interface User{
    id?:string,
    _id?:string,
    name:string,
    email:string,
    profile?:string,
    password?:string,
    isBlocked?:boolean,
    isTradesman?:boolean,
    isGoogle?:boolean,
}