export type Timeframe = 'month' | 'year';
export type Period = { year: number; month: number };

export type InvoiceStatusType = 'PAID' | 'PENDING';

export type InvoiceData = {
    date: string;
    status: InvoiceStatusType;
    total: number;
};
