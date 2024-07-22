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
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const roles_1 = __importDefault(require("../constants/roles"));
const tradesmanRepository_1 = __importDefault(require("../repository/tradesmanRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tradesmanRepository = new tradesmanRepository_1.default();
const tradesmanAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (token) {
            const accessToken = token.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_KEY);
            if (decoded.role === roles_1.default.TRADESMAN) {
                const tradesman = yield tradesmanRepository.findById(decoded.userId);
                if (tradesman) {
                    req.tradesman = tradesman._id;
                    next();
                    return;
                }
            }
        }
        res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json("Unauthorized access, Invalid token");
    }
    catch (error) {
        console.log(error);
        res.status(httpStatusCodes_1.STATUS_CODES.UNAUTHORIZED).json("Unauthorized access, Invalid token");
    }
});
exports.default = tradesmanAuth;
//# sourceMappingURL=tradesmanAuth.js.map