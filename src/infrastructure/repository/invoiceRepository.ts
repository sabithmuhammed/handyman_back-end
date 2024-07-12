import Invoice from "../../domain/invoice";
import IInvoiceRepository from "../../use_case/interface/IInvoiceRepository";
import InvoiceModel from "../database/invoiceModel";

export default class InvoiceRepository implements IInvoiceRepository {
    async createInvoice(invoice: Invoice): Promise<Invoice> {
        const newInvoice = new InvoiceModel(invoice);
        await newInvoice.save();
        return newInvoice;
    }
    async changeStatusToPaid(id: string): Promise<Invoice | null> {
        const invoice = await InvoiceModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: "paid",
                },
            },
            { new: true }
        );
        return invoice;
    }
}
