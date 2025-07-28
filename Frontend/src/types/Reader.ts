export interface Reader {
    _id: string;
    name: string
    email: string
    address: string
    phone: string
    DOB: string
    joinDate: string
}

export type ReaderFormData = {
    name: string
    email: string
    address: string
    phone: string
    DOB: string
    joinDate: string
}