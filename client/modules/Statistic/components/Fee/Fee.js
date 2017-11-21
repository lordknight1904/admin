import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import fusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import { getFeeByDay } from '../../StatisticActions';
import { getCoinList } from '../../../App/AppReducer';

class Fee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchData: [],
      data: [],
      selectedCoin: 'USDT',
      days: 30,
    };
    charts(fusionCharts);
  }
  componentDidMount() {
    this.fetchData(this.state.selectedCoin, this.state.days);
  }
  changeCoin = (eventKey) => {
    this.setState({ selectedCoin: eventKey });
    this.fetchData(eventKey, this.state.days);
  };
  changeDate = (eventKey) => {
    this.setState({ days: eventKey });
    this.fetchData(this.state.selectedCoin, eventKey);
  };
  fetchData = (coin, days) => {
    const usdtUnitArr = this.props.coinList.filter((c) => { return c.name === 'USDT'; });
    const usdtUnit = (usdtUnitArr.length > 0) ? usdtUnitArr[0].unit : 0;
    const coinUnitArr = this.props.coinList.filter((c) => { return c.name === coin; });
    const coinUnit = (coinUnitArr.length > 0) ? coinUnitArr[0].unit : 0;

    this.props.dispatch(getFeeByDay(days, coin)).then((res) => {
      const data = [];
      res.transaction.map((t, index) => {
        data.push({
          label: (index % 7 === 0) ? t.label : '',
          value: (coin === 'USDT') ? t.usdt / Number(usdtUnit) : t.coin / Number(coinUnit),
        });
      });
      this.setState({
        data,
      });
    });
  };
  render() {
    const myDataSource = {
      chart: {
        caption: 'Phí thu trong ngày',
        xAxisName: 'Ngày',
        yAxisName: `Tổng cộng(${this.state.selectedCoin})`,
        paletteColors: '#0075c2, #1aaf5d',
        showHoverEffect: '1',
        use3DLighting: '0',
        showaxislines: '1',
        theme: 'hulk-light',
        showBorder: '0',
      },
      data: this.state.data,
      // categories: [
      //   {
      //     category
      //   }
      // ],
      // dataset: [
      //   {
      //     seriesname: 'BTC',
      //     data: coin,
      //   },
      //   {
      //     seriesname: 'USDT',
      //     data: usdt,
      //   },
      // ],
    };
    const chartConfigs = {
      id: 'revenue-chart',
      type: 'line',
      width: '100%',
      height: 400,
      dataFormat: 'json',
      dataSource: myDataSource,
    };
    return (
      <div style={{ width: '45%', minWidth: '500px', margin: 'auto' }}>
        <ReactFC {...chartConfigs} />
        <DropdownButton title={this.state.selectedCoin} id="bg-nested-dropdown" onSelect={this.changeCoin}>
          <MenuItem eventKey="BTC">BTC</MenuItem>
          <MenuItem eventKey="ETH">ETH</MenuItem>
          <MenuItem eventKey="USDT">USDT</MenuItem>
        </DropdownButton>
        <DropdownButton title={`${this.state.days} ngày trước`} id="bg-nested-dropdown" onSelect={this.changeDate}>
          <MenuItem eventKey="30">30 ngày trước</MenuItem>
          <MenuItem eventKey="60">60 ngày trước</MenuItem>
          <MenuItem eventKey="90">90 ngày trước</MenuItem>
        </DropdownButton>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    coinList: getCoinList(state),
  };
}

Fee.propTypes = {
  dispatch: PropTypes.func.isRequired,
  coinList: PropTypes.array.isRequired,
};

Fee.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Fee);
