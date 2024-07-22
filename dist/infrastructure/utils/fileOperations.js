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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
class FileOperations {
    deleteFile(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof paths === "string") {
                    yield promises_1.default.unlink(paths);
                    console.log("file deleted successfully");
                    return;
                }
                yield Promise.all(paths.map((path) => __awaiter(this, void 0, void 0, function* () {
                    yield promises_1.default.unlink(path);
                })));
                console.log("files deleted successfully");
            }
            catch (error) {
                console.log("error while deleting file:", error);
            }
        });
    }
}
exports.default = FileOperations;
//# sourceMappingURL=fileOperations.js.map