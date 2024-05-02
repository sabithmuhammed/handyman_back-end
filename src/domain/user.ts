export default interface User{
    id?:string,
    _id:string,
    name:string,
    email:string,
    password:string,
    isBlocked?:boolean,
    isTradesman?:boolean
}