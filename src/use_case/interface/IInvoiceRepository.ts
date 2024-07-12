import Invoice from "../../domain/invoice";

export default interface IInvoiceRepository {
    createInvoice(invoice: Invoice): Promise<Invoice>;
    changeStatusToPaid(id:string): Promise<Invoice | null>;
}
