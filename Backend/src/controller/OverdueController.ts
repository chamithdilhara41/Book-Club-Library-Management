import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { LendingModel}  from "../models/Lending";
import { ReaderModel } from "../models/Reader"; // Adjust the import path as needed

// Get all overdue lendings
export const getOverdues = async (req: Request, res: Response) => {
    const today = new Date();
    try {
        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            returned: false,
        }).populate("readerId bookId"); // populates reader and book info

        res.status(200).json(overdueLendings);
    } catch (err) {
        res.status(500).json({ message: "Failed to retrieve overdue lendings", error: err });
    }
};

export const sendOverdueEmail = async (req: Request, res: Response) => {
    const readerId = req.params.readerId;

    try {
        // 1. Get the reader
        const reader = await ReaderModel.findById(readerId);
        if (!reader || !reader.email) {
            return res.status(404).json({ message: "Reader not found or missing email" });
        }

        // 2. Get overdue lendings for the reader
        const today = new Date();
        const overdueLendings = await LendingModel.find({
            readerId,
            dueDate: { $lt: today },
            returned: false,
        }).populate("bookId");

        if (overdueLendings.length === 0) {
            return res.status(404).json({ message: "No overdue books found for this reader." });
        }

        // 3. Format list of overdue books
        const bookList = overdueLendings
            .map((lending) => {
                const book = lending.bookId as any;
                const due = new Date(lending.dueDate).toLocaleDateString();
                return `<li><strong>${book.title}</strong> - Due on: ${due}</li>`;
            })
            .join("");

        // 4. Email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: reader.email,
            subject: "📚 Overdue Book Reminder - Book Club",
            html: `
                <p>Dear ${reader.name},</p>
                <p>This is a friendly reminder that the following book(s) are overdue:</p>
                <ul>
                    ${bookList}
                </ul>
                <p>Please return them as soon as possible to avoid further penalties.</p>
                <p>Thank you,<br/>📖 Book Club Library</p>
            `,
        };

        // 5. Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Overdue email sent to reader." });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ message: "Failed to send email", error });
    }
};

// Send overdue emails to all overdue readers
export const sendBulkOverdueEmails = async (req: Request, res: Response) => {
    const today = new Date();

    try {
        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            returned: false,
        });

        const readerIds = [...new Set(overdueLendings.map((lending) => lending.readerId.toString()))];
        const readers = await ReaderModel.find({ _id: { $in: readerIds } });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        for (const reader of readers) {
            if (!reader.email) continue;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: reader.email,
                subject: "📚 Overdue Book Reminder - Book Club",
                html: `
                    <p>Dear ${reader.name},</p>
                    <p>You have overdue books. Please return them as soon as possible.</p>
                    <p>Thank you,<br/>📖 Book Club Library</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: "Emails sent to all overdue readers" });
    } catch (error) {
        res.status(500).json({ message: "Bulk email sending failed", error });
    }
};
