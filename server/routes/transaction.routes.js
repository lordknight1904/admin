import { Router } from 'express';
import * as TransactionController from '../controllers/transaction.controller';
const router = new Router();

router.route('/transaction/fee/:date/:coin').get(TransactionController.getTransacitonFee);

export default router;
