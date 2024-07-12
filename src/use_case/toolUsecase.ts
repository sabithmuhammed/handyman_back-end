import Tool from "../domain/tool";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import ToolRepository from "../infrastructure/repository/toolRepository";

export default class ToolUsecase{
    constructor(
        private toolRepository:ToolRepository
    ){}

    async addNewTool(tool:Tool){
        const newTool = await this.toolRepository.addTool(tool)
        return {
            status:STATUS_CODES.OK,
            data:newTool
        }
    }

    async getTools(){
        const tools = await this.toolRepository.getTools()
        return {
            status:STATUS_CODES.OK,
            data:tools
        }
    }
    async getMyTools(userId:string){
        const tools = await this.toolRepository.getMyTools(userId)
        return {
            status:STATUS_CODES.OK,
            data:tools
        }
    }
}