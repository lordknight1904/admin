import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import { fetchTransaction, setTransactionDetail, setConfirmation, getConfirmation, setTxHash } from '../../TransactionActions';
import {
  getTransaction, getMaxPage, getCurrentPage, getToggle, getTransactionDetail, getFeeCoin, getFeeUsdt,
  getCoin, getCount,
} from '../../TransactionReducer';
import { getId } from '../../../Login/LoginReducer';
import { setNotify } from '../../../App/AppActions';
import { getCoinList } from '../../../App/AppReducer';
import numeral from 'numeral';
import styles from './TransactionList.css';

class TransactionList extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(fetchTransaction(this.props.count, this.props.currentPage - 1, this.props.toggle));
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
  tooltip = (str) => (
    <Tooltip id={`tooltip${str}`} style={{ wordBreak: 'break-word' }}>
      {str}
    </Tooltip>
  );
  render() {
    const usdt = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const unit2 = (usdt.length > 0) ? usdt[0].unit : 0;
    const coin = this.props.coinList.filter((c) => { return c.name === this.props.coin; });
    const unit = (coin.length > 0) ? coin[0].unit : 0;
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
            <th style={{ width: '8%' }}>Phí coin</th>
            <th style={{ width: '7%' }}>Phí Usdt</th>
            <th style={{ width: '10%' }}>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.transaction.map((a, index) => {
            const date = new Date(a.dateCreated);
            const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
            const time = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${hours}:${minutes}`;
            return (
              <tr key={index}>
                <td className={styles.customTable}>{(a.from) ? a.from.userName : ''}</td>
                <td className={styles.customTable}>{(a.to) ? a.to.userName : ''}</td>
                <td className={styles.customTable}>{numeral(a.amount / unit).format('0,0.[000000]')}</td>
                <td className={styles.customTable}>{a.coin}</td>
                <td className={styles.customTable}>
                  {`${numeral(a.amount / unit * a.price).format('0,0.[000000]')}(${numeral(a.price).format('0,0.[000000]')}/${a.coin})`}
                </td>
                <td onClick={() => { this.detail(a, a.hasOwnProperty('txCoin') ? a.txCoin : '---'); }}>
                  <OverlayTrigger placement="top" overlay={this.tooltip(a.hasOwnProperty('txCoin') ? a.txCoin : '---')}>
                    <div className={styles.customTable}>{a.hasOwnProperty('txCoin') ? a.txCoin : '---'}</div>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={this.tooltip(numeral(a.feeCoin).value() / unit)}>
                    <div className={styles.customTable}>{numeral(a.feeCoin).value() / unit}</div>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={this.tooltip(numeral(a.feeUsdt).value())}>
                    <div className={styles.customTable}>{numeral(a.feeUsdt).value()}</div>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={this.tooltip(time)}>
                    <div className={styles.customTable}>{time}</div>
                  </OverlayTrigger>
                </td>
              </tr>
            );
          })
        }
          <tr>
            <td className={styles.customTable} colSpan="3">
              Tổng cộng
            </td>
            <td className={styles.customTable} colSpan="3">
              {numeral(this.props.feeCoin).value() / unit}
            </td>
            <td className={styles.customTable} colSpan="3">
              {numeral(this.props.feeUsdt).value()}
            </td>
          </tr>
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
    coin: getCoin(state),
    feeCoin: getFeeCoin(state),
    feeUsdt: getFeeUsdt(state),
    count: getCount(state),
  };
}

TransactionList.propTypes = {
  transactionDetail: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  transaction: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  feeUsdt: PropTypes.number.isRequired,
  feeCoin: PropTypes.number.isRequired,
  toggle: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

TransactionList.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TransactionList);
