import express from 'express';
import {
    lendBook,
    returnBook,
    getAllLendings,
    getLendingsByReader,
    getLendingsByBook
} from '../controller/LendingController';

const router = express.Router();

router.post('/', lendBook);
router.put('/return/:id', returnBook);
router.get('/', getAllLendings);
router.get('/reader/:readerId', getLendingsByReader);
router.get('/book/:bookId', getLendingsByBook);

export default router;
