export default interface Ijwt{
    createJWT(userId:string,role:string):string
}