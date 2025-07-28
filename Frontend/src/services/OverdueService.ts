import axios from "axios";
import type {Lending} from "../types/Lending";

export const fetchOverdueLendings = async (): Promise<Lending[]> => {
    const response = await axios.get("/api/lendings/overdue");
    return response.data;
};

export const notifyReader = async (readerId: string): Promise<void> => {
    await axios.post(`/api/lendings/notify-overdue/${readerId}`);
};
