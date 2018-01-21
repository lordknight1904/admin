import Deposit from '../models/deposit';

export function createDeposit(req, res) {
  const reqDeposit = req.body.deposit;
  console.log(reqDeposit);
  if (reqDeposit &&
    reqDeposit.hasOwnProperty('userId') &&
    reqDeposit.hasOwnProperty('value')
  ) {
    const deposit = new Deposit({
      userId: reqDeposit.userId,
      value: reqDeposit.value,
    });
    deposit.save((err, deposit) => {
      if(err) {
        console.log(err);
        res.json({ deposit: { code: 'error' } });
      } else{
        res.json({ deposit: { code: 'success' } });
      }
    });
  }
}
