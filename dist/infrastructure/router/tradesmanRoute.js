"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtCreate_1 = __importDefault(require("../utils/jwtCreate"));
const tradesmanRepository_1 = __importDefault(require("../repository/tradesmanRepository"));
const tradesmanUsecase_1 = __importDefault(require("../../use_case/tradesmanUsecase"));
const tradesmanController_1 = __importDefault(require("../../adapter/tradesmanController"));
const multer_1 = require("../middlewares/multer");
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const fileOperations_1 = __importDefault(require("../utils/fileOperations"));
const tradesmanAuth_1 = __importDefault(require("../middlewares/tradesmanAuth"));
const tradesmanRouter = express_1.default.Router();
const jwtCreate = new jwtCreate_1.default();
const cloudinary = new cloudinary_1.default();
const fileOperations = new fileOperations_1.default();
const tradesmanRepository = new tradesmanRepository_1.default();
const tradesmanUsecase = new tradesmanUsecase_1.default(tradesmanRepository, jwtCreate);
const controller = new tradesmanController_1.default(tradesmanUsecase, cloudinary, fileOperations);
tradesmanRouter.post("/register", multer_1.Multer.array("images"), userAuth_1.default, (req, res, next) => controller.register(req, res, next));
tradesmanRouter.get("/check-status", userAuth_1.default, (req, res, next) => controller.tradesmanExistCheck(req, res, next));
tradesmanRouter.get("/get-profile/:tradesmanId", (req, res, next) => controller.getProfileMinimum(req, res, next));
tradesmanRouter.get("/get-profile-full", tradesmanAuth_1.default, (req, res, next) => controller.getProfileFull(req, res, next));
tradesmanRouter.patch("/update-configuration", tradesmanAuth_1.default, (req, res, next) => controller.updateConfiguration(req, res, next));
exports.default = tradesmanRouter;
//# sourceMappingURL=tradesmanRoute.js.map