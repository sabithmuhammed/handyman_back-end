import Tool from "../../domain/tool";

export default interface iToolRepository {
    addTool(tool: Tool): Promise<Tool>;
    getTools(): Promise<Tool[]>;
}
