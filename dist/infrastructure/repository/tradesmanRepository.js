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
const tradesmanModel_1 = __importDefault(require("../database/tradesmanModel"));
class TradesmanRepository {
    saveTradesman(tradesman) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTradesman = new tradesmanModel_1.default(tradesman);
            yield newTradesman.save();
            return newTradesman;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield tradesmanModel_1.default.findOne({ userId });
            return tradesman;
        });
    }
    getAllPendingTradesmen() {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesmen = yield tradesmanModel_1.default.find({
                verificationStatus: "pending",
            });
            return tradesmen;
        });
    }
    changeVerificationStatus(tradesmanId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(status, "hjkhjjk");
            const tradesman = yield tradesmanModel_1.default.findByIdAndUpdate(tradesmanId, {
                $set: {
                    verificationStatus: status,
                },
            }, { new: true });
            return tradesman;
        });
    }
    getAllTradesmanWithFilter(page, pageSize, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let tradesmen = null;
            const offset = (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
            const totalCount = yield tradesmanModel_1.default.countDocuments({
                verificationStatus: "verified",
                skills: { $regex: ".*" + filters.category + ".*", $options: "i" },
            });
            tradesmen = yield tradesmanModel_1.default.find({
                verificationStatus: "verified",
                category: { $regex: ".*" + filters.category + ".*", $options: "i" },
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: filters.coordinates,
                        },
                        $maxDistance: 10000,
                    },
                },
            })
                .skip(offset)
                .limit(pageSize ? Number(pageSize) : 10);
            return {
                tradesmen,
                totalCount,
                page: page ? Number(page) : 1,
            };
        });
    }
    toggleBlock(tradesmaId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield tradesmanModel_1.default.findByIdAndUpdate(tradesmaId, {
                $set: { isBlocked: status },
            }, { new: true });
            return tradesman;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield tradesmanModel_1.default.findById(id);
            return tradesman;
        });
    }
    getUniqueSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield tradesmanModel_1.default.aggregate([
                { $group: { _id: null, uniqueSkills: { $addToSet: "$category" } } },
                {
                    $project: {
                        uniqueSkills: {
                            $map: {
                                input: "$uniqueSkills",
                                as: "skill",
                                in: { $toString: "$$skill" },
                            },
                        },
                    },
                },
            ]);
            if (result[0]) {
                return result[0].uniqueSkills;
            }
            return [];
        });
    }
    getAllTradesman(page, pageSize, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let tradesmen = null;
            const offset = (page ? Number(page) - 1 : 0) * (pageSize ? Number(pageSize) : 10);
            const totalCount = yield tradesmanModel_1.default.countDocuments({
                verificationStatus: "verified",
                category: { $regex: ".*" + filters.category + ".*", $options: "i" },
            });
            tradesmen = yield tradesmanModel_1.default.find({
                verificationStatus: "verified",
                skills: { $regex: ".*" + filters.category + ".*", $options: "i" },
            })
                .skip(offset)
                .limit(pageSize ? Number(pageSize) : 10);
            return {
                tradesmen,
                totalCount,
                page: page ? Number(page) : 1,
            };
        });
    }
    getProfileFull(tradesmanId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield tradesmanModel_1.default.findById(tradesmanId);
            return tradesman;
        });
    }
    updateConfiguration(tradesmanId, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradesman = yield tradesmanModel_1.default.findByIdAndUpdate(tradesmanId, {
                $set: {
                    configuration: config,
                },
            }, { new: true });
            return tradesman;
        });
    }
}
exports.default = TradesmanRepository;
//# sourceMappingURL=tradesmanRepository.js.map