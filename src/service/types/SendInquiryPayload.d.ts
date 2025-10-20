export interface SendInquiryPayload {
    organization: string;
    email: string;
    name: string;
    message: string;
    marketing: boolean;
    title: string;
    offering: string;
}