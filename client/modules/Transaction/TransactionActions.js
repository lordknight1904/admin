import callApi from '../../util/apiCaller';
// Export Constants
export const ACTIONS = {
  SET_TRANSACTION_CURRENT_PAGE: 'SET_TRANSACTION_CURRENT_PAGE',
  SET_TRANSACTION_MAX_PAGE: 'SET_TRANSACTION_MAX_PAGE',
  SET_TRANSACTION: 'SET_TRANSACTION',
  SET_TRANSACTION_TOGGLE: 'SET_TRANSACTION_TOGGLE',
  SET_TRANSACTION_DETAIL: 'SET_TRANSACTION_DETAIL',
  CLOSE_TRANSACTION: 'CLOSE_TRANSACTION',
  SET_CONFIRMATION: 'SET_CONFIRMATION',
  SET_TX_HASH: 'SET_TX_HASH',
  SET_TRANSACTION_DATE: 'SET_TRANSACTION_DATE',
  SET_TRANSACTION_COIN: 'SET_TRANSACTION_COIN',
  SET_TRANSACTION_FEE: 'SET_TRANSACTION_FEE',
};
export function setTransactionCoin(coin) {
  return {
    type: ACTIONS.SET_TRANSACTION_COIN,
    coin,
  };
}
export function setTransactionFee(transaction) {
  return {
    type: ACTIONS.SET_TRANSACTION_FEE,
    transaction,
  };
}
export function fee(count, coin) {
  return (dispatch) => {
    return callApi(`transaction/fee/${count}/${coin}`, 'get', '').then(res => {
      dispatch(setTransactionFee(res.transaction));
    });
  };
}
export function setDate(date) {
  return {
    type: ACTIONS.SET_TRANSACTION_DATE,
    date,
  };
}
export function setTxHash(txHash) {
  return {
    type: ACTIONS.SET_TX_HASH,
    txHash,
  };
}
export function setConfirmation(confirmations) {
  return {
    type: ACTIONS.SET_CONFIRMATION,
    confirmations,
  };
}
export function setTransactionDetail(transaction) {
  return {
    type: ACTIONS.SET_TRANSACTION_DETAIL,
    transaction,
  };
}
export function getConfirmation(coin, txHash) {
  return (dispatch) => {
    return callApi(`transaction/hash/${coin}/${txHash}`, 'get', '').then(res => {
      dispatch(setConfirmation(res.confirmations));
    });
  };
}
export function fix() {
  return () => {
    return callApi('transaction/fix', 'post', '').then(() => {});
  };
}
export function closeTransactionDetail() {
  return {
    type: ACTIONS.CLOSE_TRANSACTION,
  };
}
export function setToggle(toggle) {
  return {
    type: ACTIONS.SET_TRANSACTION_TOGGLE,
    toggle,
  };
}
export function setCurrentPage(page) {
  return {
    type: ACTIONS.SET_TRANSACTION_CURRENT_PAGE,
    page,
  };
}
export function setMaxPage(page) {
  return {
    type: ACTIONS.SET_TRANSACTION_MAX_PAGE,
    page,
  };
}
export function setTransaction(transaction) {
  return {
    type: ACTIONS.SET_TRANSACTION,
    transaction,
  };
}
export function fetchTransaction(date, page, toggle) {
  return (dispatch) => {
    return callApi(`transaction?date=${date}&page=${page}&toggle=${toggle}`, 'get', '').then(res => {
      dispatch(setTransaction(res.transaction));
      dispatch(setMaxPage(res.count));
      dispatch(setCurrentPage(1));
    });
  };
}
