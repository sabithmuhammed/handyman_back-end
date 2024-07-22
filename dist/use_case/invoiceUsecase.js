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
class InvoiceUsecase {
    constructor(invoiceRepository, generateUniqueId) {
        this.invoiceRepository = invoiceRepository;
        this.generateUniqueId = generateUniqueId;
    }
    createNewInvoice(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            invoice.invoiceNumber = this.generateUniqueId({
                length: 10,
                useLetters: false,
            });
            const result = yield this.invoiceRepository.createInvoice(invoice);
            return {
                status: httpStatusCodes_1.STATUS_CODES.OK,
                data: result,
            };
        });
    }
    changeStatusToPaid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.invoiceRepository.changeStatusToPaid(id);
            if (result) {
                return {
                    status: httpStatusCodes_1.STATUS_CODES.OK,
                    data: result,
                };
            }
            return {
                status: httpStatusCodes_1.STATUS_CODES.NOT_FOUND,
                data: "Invoice not found",
            };
        });
    }
}
exports.default = InvoiceUsecase;
//# sourceMappingURL=invoiceUsecase.js.map