export interface Lending {
    _id?: string;
    bookId: string;
    readerId: string;
    lendDate: string;
    dueDate: string;
    returnDate: string;
    returned: boolean;
}
