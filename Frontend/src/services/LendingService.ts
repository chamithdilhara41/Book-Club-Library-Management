import apiClient from "./apiClient.ts";

export const getAllLendings = async () => {
    const res = await apiClient.get("/lendings");
    return res.data;
};

export const createLending = async (data: { bookId: string; readerId: string; dueDate:string; returnDate:string }) => {
    const res = await apiClient.post("/lendings", data);
    return res.data;
};

export const returnLending = async (id: string) => {
    const res = await apiClient.put(`/lendings/return/${id}`);
    return res.data;
};
