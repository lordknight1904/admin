// Import Actions
import { ACTIONS } from './TransactionActions';
// Initial State
const initialState = {
  currentPage: 1,
  maxPage: 1,
  transaction: [],
  toggle: '0',
  detail: false,
  transactionDetail: {},
  txHash: '',
  confirmations: -1,
};

const TransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TX_HASH:
      return { ...state, txHash: action.txHash };
    case ACTIONS.SET_CONFIRMATION:
      return { ...state, confirmations: action.confirmations };
    case ACTIONS.SET_TRANSACTION_DETAIL:
      return { ...state, detail: true, transactionDetail: action.transaction };
    case ACTIONS.CLOSE_TRANSACTION:
      return { ...state, detail: false };
    case ACTIONS.SET_TRANSACTION_TOGGLE:
      return { ...state, toggle: action.toggle };
    case ACTIONS.SET_TRANSACTION_CURRENT_PAGE:
      return { ...state, currentPage: action.page };
    case ACTIONS.SET_TRANSACTION_MAX_PAGE:
      return { ...state, maxPage: action.page };
    case ACTIONS.SET_TRANSACTION:
      return { ...state, transaction: action.transaction };
    default:
      return state;
  }
};

export const getDetail = state => state.transaction.detail;
export const getTxHash = state => state.transaction.txHash;
export const getTransactionDetail = state => state.transaction.transactionDetail;
export const getConfirmations = state => state.transaction.confirmations;
export const getToggle = state => state.transaction.toggle;
export const getCurrentPage = state => state.transaction.currentPage;
export const getMaxPage = state => state.transaction.maxPage;
export const getTransaction = state => state.transaction.transaction;

export default TransactionReducer;

