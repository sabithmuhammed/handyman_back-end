import Tool from "../../domain/tool";
import iToolRepository from "../../use_case/interface/IToolRepository";
import ToolModel from "../database/toolsModel";

export default class ToolRepository implements iToolRepository {
    async addTool(tool: Tool): Promise<Tool> {
        const newTool = new ToolModel(tool);
        await newTool.save();
        return newTool;
    }
    async getTools(): Promise<Tool[]> {
        const tools = await ToolModel.find();
        return tools;
    }

    async getMyTools(userId: string): Promise<Tool[]> {
        const tools = await ToolModel.find({ userId });
        return tools;
    }
}
