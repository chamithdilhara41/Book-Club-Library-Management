export interface Book {
    _id: string;
    title: string,
    author: string,
    isbn: string,
    publishedDate: string,
    genre: string,
    quantity: number,
    available: boolean;
}