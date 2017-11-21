import Transaction from '../models/transaction';
import User from '../models/user';
import sanitizeHtml from 'sanitize-html';

export function getTransacitonFee(req, res) {
  if (req.params.date && req.params.coin) {
    const today = new Date();
    const from = new Date();
    const to = new Date();
    from.setDate(today.getDate() - Number(req.params.date));
    from.setHours(0, 0, 0, 0);
    to.setHours(24, 0, 0, 0);
    Transaction.aggregate([
      {
        $match: {
          coin: (req.params.coin.toUpperCase() !== 'USDT') ? req.params.coin.toUpperCase() : new RegExp('.'),
          dateCreated: { $gte: from, $lte: to },
        },
      },
      {
        $project: {
          dateCreated: { $dateToString: { format: '%Y-%m-%d', date: '$dateCreated' } },
          feeCoin: '$feeCoin',
          feeUsdt: '$feeUsdt',
        },
      },
      {
        $group: {
          _id: '$dateCreated',
          coin: { $sum: '$feeCoin' },
          usdt: { $sum: '$feeUsdt' },
        },
      },
    ])
      .exec((err, transaction) => {
        if (err) {
          res.json({ transaction: [] });
        } else {
          let response = [];
          for (let i = 0; i < req.params.date; i++) {
            const tD = new Date();
            tD.setDate(today.getDate() - i);
            response.push({
              label: `${tD.getDate()}/${tD.getMonth()}/${tD.getYear() + 1900}`,
              coin: 0,
              usdt: 0,
            });
          }
          transaction.map((t) => {
            const tempDate = new Date(t._id);
            for (let i = 0; i < req.params.date; i++) {
              if (response[i].label === `${tempDate.getDate()}/${tempDate.getMonth()}/${tempDate.getYear() + 1900}`) {
                response[i].coin = t.coin;
                response[i].usdt = t.usdt;
              }
            }
          });
          if (transaction.length > 0) {
            res.json({ transaction: response });
          } else {
            res.json({ transaction: [] });
          }
        }
      });
  } else {
    res.json({ transaction: [] });
  }
}
