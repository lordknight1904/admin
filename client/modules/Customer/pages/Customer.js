import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Modal, Table, Button } from 'react-bootstrap';
import CustomerNavBar from '../components/CustomerNavBar/CustomerNavBar';
import CustomerList from '../components/CustomerList/CustomerList';

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      isView: false,
    };
  }
  onUserProfile = (userProfile) => {
    this.setState({ userProfile, isView: true });
  };
  onHide = () => {
    this.setState({ userProfile: {}, isView: false });
  };
  render() {
    return (
      <div>
        <Row>
          <CustomerNavBar />
        </Row>
        <Row>
          <CustomerList onUserProfile={this.onUserProfile} />
        </Row>

        <Modal
          show={this.state.isView}
          onHide={this.onHide}
        >
          <Modal.Header>
            <Modal.Title>Thông tin khách hàng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered condensed hover>
              <tbody>
                <tr>
                  <td>Tên</td>
                  <td>{this.state.userProfile.realName}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>{this.state.userProfile.phone}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onHide}>Thoát</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
  };
}

Customer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

Customer.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Customer);
