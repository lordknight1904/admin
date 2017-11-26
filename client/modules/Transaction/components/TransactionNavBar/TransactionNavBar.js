import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navbar, Nav, NavItem, Pagination, Checkbox, Button } from 'react-bootstrap';
import styles from './TransactionNavBar.css';
import { setToggle, setCurrentPage, fetchTransaction, fix } from '../../TransactionActions';
import { getCurrentPage, getMaxPage, getToggle, getTransaction } from '../../TransactionReducer';

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
    this.props.dispatch(fetchTransaction(this.props.currentPage - 1, check.toString()));
    this.props.dispatch(setToggle(check.toString()));
  };
  handlePage = (eventKey) => {
    this.props.dispatch(setCurrentPage(eventKey - 1));
    this.props.dispatch(fetchTransaction(eventKey - 1, this.props.toggle));
  };
  onFix = () => {
    this.setState({ disabled: true });
    this.props.dispatch(fix()).then(() => {
      this.setState({ disabled: false });
    });
  };
  render() {
    return (
      <Navbar className={styles.cointain}>
        <Nav>
          <NavItem componentClass="span">
            <Pagination
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
            <Checkbox checked={this.state.check} onClick={() => this.onClick((this.props.toggle === '0') ? '1' : '0')}>Xem lệnh lỗi</Checkbox>
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem>
            <Button bsStyle="success" disabled={this.state.disabled} onClick={this.onFix}>Thực thi lệnh chuyển khoản lỗi</Button>
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
  };
}

TransactionNavBar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  transaction: PropTypes.array.isRequired,
  toggle: PropTypes.string.isRequired,
};

TransactionNavBar.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(TransactionNavBar);
