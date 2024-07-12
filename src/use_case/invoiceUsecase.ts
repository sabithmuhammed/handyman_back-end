import GenerateUniqueId from "generate-unique-id";
import Invoice from "../domain/invoice";
import { STATUS_CODES } from "../infrastructure/constants/httpStatusCodes";
import InvoiceRepository from "../infrastructure/repository/invoiceRepository";

export default class InvoiceUsecase {
    constructor(
        private invoiceRepository: InvoiceRepository,
        private generateUniqueId: typeof GenerateUniqueId
    ) {}

    async createNewInvoice(invoice: Invoice) {
        invoice.invoiceNumber = this.generateUniqueId({
            length: 10,
            useLetters: false,
        });
        const result = await this.invoiceRepository.createInvoice(invoice);
        return {
            status: STATUS_CODES.OK,
            data: result,
        };
    }

    async changeStatusToPaid(id: string) {
        const result = await this.invoiceRepository.changeStatusToPaid(id);
        if (result) {
            return {
                status: STATUS_CODES.OK,
                data: result,
            };
        }
        return {
            status: STATUS_CODES.NOT_FOUND,
            data: "Invoice not found",
        };
    }

    
}
