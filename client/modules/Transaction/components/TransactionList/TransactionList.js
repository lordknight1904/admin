import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Table } from 'react-bootstrap';
import { fetchTransaction, setTransactionDetail, setConfirmation, getConfirmation, setTxHash } from '../../TransactionActions';
import { getTransaction, getMaxPage, getCurrentPage, getToggle, getTransactionDetail } from '../../TransactionReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';
import { getCoinList } from '../../../App/AppReducer';
import numeral from 'numeral';

class TransactionList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(fetchTransaction(this.props.currentPage - 1, this.props.toggle));
  }
  detail = (transaction, tx) => {
    if (tx === '---') return;
    const userName = (tx === transaction.txCoin) ? transaction.from.userName : transaction.to.userName;
    this.props.dispatch(setTransactionDetail(transaction));
    this.props.dispatch(setTxHash(tx));
    if (JSON.stringify(this.props.transactionDetail) !== JSON.stringify(transaction)) {
      this.props.dispatch(setConfirmation(-1));
      const bool = userName === transaction.from.userName;
      const coin = bool ? transaction.coin : 'USDT';
      const txHash = bool ? transaction.txCoin : transaction.txUsdt;
      this.props.dispatch(getConfirmation(coin, txHash));
    }
  };
  render() {
    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (usdt.length > 0) ? usdt[0].unit : 0;
    return (
      <Table striped bordered condensed hover style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Từ tài khoản</th>
            <th style={{ width: '15%' }}>Đến tài khoản</th>
            <th style={{ width: '8%' }}>Số lượng</th>
            <th style={{ width: '8%' }}>Coin</th>
            <th style={{ width: '14%' }}>Giá</th>
            <th style={{ width: '15%' }}>hash Coin</th>
            <th style={{ width: '15%' }}>hash Usdt</th>
            <th style={{ width: '10%' }}>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.transaction.map((a, index) => {
            const coin = this.props.coinList.filter((c) => { return c.name === a.coin; });
            const unit = (coin.length > 0) ? coin[0].unit : 0;

            const date = new Date(a.dateCreated);
            const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const time = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}`;
            return (
              <tr key={index}>
                <td style={{ wordWrap: 'break-word' }}>{a.from.userName}</td>
                <td style={{ wordWrap: 'break-word' }}>{a.to.userName}</td>
                <td style={{ wordWrap: 'break-word' }}>{numeral(a.amount / unit).format('0,0.[000000]')}</td>
                <td>{a.coin}</td>
                <td style={{ wordWrap: 'break-word' }}>{`${numeral(a.amount / unit * a.price).format('0,0.[000000]')}(${numeral(a.price).format('0,0.[000000]')}/${a.coin})`}</td>
                <td style={{ wordWrap: 'break-word' }} onClick={() => { this.detail(a, a.hasOwnProperty('txCoin') ? a.txCoin : '---'); }}>
                  {a.hasOwnProperty('txCoin') ? a.txCoin : '---'}
                </td>
                <td style={{ wordWrap: 'break-word' }} onClick={() => { this.detail(a, a.hasOwnProperty('txUsdt') ? a.txUsdt : '---'); }}>
                  {a.hasOwnProperty('txUsdt') ? a.txUsdt : '---'}
                </td>
                <td>{time}</td>
              </tr>
            );
          })
        }
        </tbody>
      </Table>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    transaction: getTransaction(state),
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
    toggle: getToggle(state),
    coinList: getCoinList(state),
    transactionDetail: getTransactionDetail(state),
  };
}

TransactionList.propTypes = {
  transactionDetail: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  transaction: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  toggle: PropTypes.string.isRequired,
};

TransactionList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TransactionList);
