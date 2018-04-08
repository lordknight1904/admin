import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Pagination, Checkbox, DropdownButton, MenuItem } from 'react-bootstrap';
import styles from './TransactionNavBar.css';
import { setToggle, setCurrentPage, fetchTransaction, setDate, setTransactionCoin, fee } from '../../TransactionActions';
import {
  getCurrentPage, getDate, getMaxPage, getToggle, getTransaction, getCoin,
  getCount
} from '../../TransactionReducer';
import DatePicker from 'react-bootstrap-date-picker';
import { getCoinList } from '../../../App/AppReducer';

class TransactionNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      disabled: false,
    };
  }

  onClick = (check) => {
    this.setState({ check: check.toString() === '1' });
    this.props.dispatch(fetchTransaction(this.props.count, this.props.currentPage - 1, check.toString()));
    this.props.dispatch(setToggle(check.toString()));
  };
  onCoin = (eventKey) => {
    this.setState({ title: eventKey });
    this.props.dispatch(setTransactionCoin(eventKey));
    this.update(this.props.count, eventKey);
  };
  dateDiff = (datepart, fromdate, todate) => {
    const diff = new Date(new Date(todate) - new Date(fromdate));
    const divideBy = {
      w: 604800000,
      d: 86400000,
      h: 3600000,
      n: 60000,
      s: 1000,
    };
    return Math.floor(diff / divideBy[datepart.toLowerCase()]);
  };
  handleChange = (value, formattedValue) => {
    this.props.dispatch(setDate(value, formattedValue));
    const count = this.dateDiff('d', value, new Date());
    this.props.dispatch(fetchTransaction(count, 0, this.props.toggle));
    this.props.dispatch(fee(count, this.props.coin));
  };
  update = (count, coin) => {
    this.props.dispatch(fee(count, coin));
  };
  render() {
    return (
      <Navbar className={styles.cointain}>
        <Nav>
          <NavItem>
            <DropdownButton
              title={this.props.coin}
              id="dropdown-basic"
            >
              {
                this.props.coinList.map((cl, index) => (
                  <MenuItem key={index} eventKey={cl.name} onClick={() => { this.onCoin(cl.name) }}>{cl.name}</MenuItem>
                ))
              }
            </DropdownButton>
          </NavItem>
          <NavItem componentClass="span" style={{ width: '40%', margin: '10px 0' }}>
            <DatePicker value={this.props.date} onChange={this.handleChange} />
          </NavItem>
          <NavItem componentClass="span">
            <Pagination
              className={styles.customPagination}
              bsSize="small"
              first
              last
              boundaryLinks
              activePage={this.props.currentPage}
              items={this.props.maxPage}
              maxButtons={5}
              onSelect={this.hanldePage}
            />
          </NavItem>
          <NavItem>
            <Checkbox
              className={styles.customCheckbox}
              checked={this.state.check}
              onClick={() => this.onClick((this.props.toggle === '0') ? '1' : '0')}
            >
              Xem lệnh lỗi
            </Checkbox>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    toggle: getToggle(state),
    currentPage: getCurrentPage(state),
    maxPage: getMaxPage(state),
    transaction: getTransaction(state),
    date: getDate(state),
    coin: getCoin(state),
    coinList: getCoinList(state),
    count: getCount(state),
  };
}

TransactionNavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  transaction: PropTypes.array.isRequired,
  coinList: PropTypes.array.isRequired,
  toggle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired,
};

TransactionNavBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TransactionNavBar);
