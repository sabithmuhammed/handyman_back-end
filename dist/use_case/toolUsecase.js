"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = require("../infrastructure/constants/httpStatusCodes");
class ToolUsecase {
    constructor(toolRepository) {
        this.toolRepository = toolRepository;
    }
    addNewTool(tool) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTool = yield this.toolRepository.addTool(tool);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: newTool
            };
        });
    }
    getTools() {
        return __awaiter(this, void 0, void 0, function* () {
            const tools = yield this.toolRepository.getTools();
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: tools
            };
        });
    }
    getMyTools(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tools = yield this.toolRepository.getMyTools(userId);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: tools
            };
        });
    }
}
exports.default = ToolUsecase;
//# sourceMappingURL=toolUsecase.js.map