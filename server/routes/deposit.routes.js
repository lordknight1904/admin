import { Router } from 'express';
import * as DepositController from '../controllers/deposit.controller';
const router = new Router();

router.route('/deposit').post(DepositController.createDeposit);

export default router;
