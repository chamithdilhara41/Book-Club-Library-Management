import type { Reader } from "../types/Reader"
import apiClient from "./apiClient"

export const getAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get("/readers")
    return response.data
}

export const deleteReader = async (_id: string): Promise<void> => {
    await apiClient.delete(`/readers/${_id}`)
}

export const addReader = async (readerData: Omit<Reader, "_id">): Promise<Reader> => {
    const response = await apiClient.post("/readers", readerData)
    return response.data
}

export const updateReader = async (_id: string, readerData: Omit<Reader, "_id">) => {
    const response = await apiClient.put(`/readers/${_id}`, readerData)
    return response.data
}
