import React, { useState, useEffect } from "react"
import type { Reader, ReaderFormData } from "../../types/Reader"

interface ReaderFormProps {
    reader?: Reader | null
    onSubmit: (readerData: Omit<Reader, "_id">) => void
}

interface FormErrors {
    name?: string
    email?: string
    phone?: string
    address?: string
    DOB?: string
    joinDate?: string
}

const today = new Date().toISOString().split("T")[0];

const ReaderForm = ({ reader, onSubmit }: ReaderFormProps) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        DOB: "",
        joinDate: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (reader) {
            setFormData({
                name: reader.name,
                email: reader.email,
                phone: reader.phone,
                address: reader.address,
                DOB: reader.DOB,
                joinDate: reader.joinDate,
            })
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                DOB: "",
                joinDate: "",
            })
        }
        setErrors({})
    }, [reader])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) newErrors.name = "Name is required"
        else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters"

        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"

        if (!formData.phone.trim()) newErrors.phone = "Phone is required"
        else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) newErrors.phone = "Invalid phone number"

        if (!formData.address.trim()) newErrors.address = "Address is required"
        else if (formData.address.trim().length < 5) newErrors.address = "Address too short"

        if (!formData.DOB.trim()) newErrors.DOB = "Date of Birth is required"
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.DOB)) newErrors.DOB = "Use YYYY-MM-DD format"

        if (!formData.joinDate.trim()) newErrors.joinDate = "Join Date is required"
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.joinDate)) newErrors.joinDate = "Use YYYY-MM-DD format"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name */}
            <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.name ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder='Enter full name'
                />
                {errors.name && <p className='text-sm text-red-600'>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.email ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder='Enter email'
                />
                {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.phone ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder='Enter phone number'
                />
                {errors.phone && <p className='text-sm text-red-600'>{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                <textarea
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.address ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder='Enter address'
                />
                {errors.address && <p className='text-sm text-red-600'>{errors.address}</p>}
            </div>

            {/* Date of Birth */}
            <div>
                <label htmlFor='DOB' className='block text-sm font-medium text-gray-700 mb-1'>Date of Birth</label>
                <input
                    type='date'
                    name='DOB'
                    value={formData.DOB}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.DOB ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.DOB && <p className='text-sm text-red-600'>{errors.DOB}</p>}
            </div>

            {/* Join Date */}
            <div>
                <label htmlFor='joinDate' className='block text-sm font-medium text-gray-700 mb-1'>Join Date</label>
                <input
                    type='date'
                    name='joinDate'
                    value={today}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                        errors.joinDate ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.joinDate && <p className='text-sm text-red-600'>{errors.joinDate}</p>}
            </div>
        </form>
    )
}

export default ReaderForm
