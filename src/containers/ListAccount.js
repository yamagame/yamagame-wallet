import React, { Component } from 'react';
import { connect } from 'react-redux'
import MenuButton from './MenuButton';
import Row from './Row';
import {
  loadAccount,
  startLoading,
  stopLoading,
  fontScale,
} from '../reducers'

function Item({ value, onClick }) {
  const date = new Date(value.date);
  var color = 'white';
  if (date.getDay() == 0) {
    //sunday
    color = 'pink';
  } else
  if (date.getDay() == 6) {
    //saturday
    color = '#8EF';
  } else {
    //others
  }
  return (
    <div className="Item-Container" onClick={ onClick }>
      <Row>
        <div style={{ height: '100%', backgroundColor: `${color}`, borderRight: 'lightgray solid 1px' }} >
        <p style={ { margin: 8, padding: 8, height: fontScale(16), fontSize: `${fontScale(12)}px`, flex: 1, } }> { value.day } </p>
        </div>
        <p style={ { textAlign: 'center', margin: 8, padding: 8, height: fontScale(16), fontSize: `${fontScale(12)}px`, flex: 5, overflow: 'hidden', } }> { value.debit } </p>
        <p style={ { textAlign: 'center', margin: 8, padding: 8, height: fontScale(16), fontSize: `${fontScale(12)}px`, flex: 1, textAlign: 'right', } }> { value.value } </p>
        <p style={ { textAlign: 'center', margin: 8, padding: 8, height: fontScale(16), fontSize: `${fontScale(12)}px`, flex: 5, overflow: 'hidden', } }> { value.credit } </p>
      </Row>
    </div>
  )
}

class ListAccount extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      now,
      year: now.getFullYear(),
      month: now.getMonth()+1,
    }
  }

  componentDidMount() {
    this.loadAccount()
  }

  loadAccount = () => {
    this.props.startLoading(() => {
      this.props.loadAccount({ year: this.state.year, month: this.state.month }, () => {
        this.props.stopLoading();
      });
    });
  }

  doMinus = () => {
    console.log('doMinus');
    const now = new Date(this.state.year, this.state.month-2, 1);
    this.setState({
      now,
      year: now.getFullYear(),
      month: now.getMonth()+1,
    }, this.loadAccount)
  }

  doPlus = () => {
    console.log('doPlus');
    const now = new Date(this.state.year, this.state.month, 1);
    this.setState({
      now,
      year: now.getFullYear(),
      month: now.getMonth()+1,
    }, this.loadAccount)
  }

  render() {
    return (
      <div className="App">
        {/*<p>{ window.innerWidth } { window.innerHeight } { window.devicePixelRatio }</p>*/}
        <div className="Item-Container">
          <Row>
            <span style={ { flex: 1, fontSize: `${fontScale(22)}px`, margin: 'auto', } } onClick={this.props.goEditor}>{ this.props.title }</span>
            <MenuButton type="button" value="もどる" onClick={this.props.goBack} style={ { width: '40%', height: '100%', } }/>
          </Row>
          <Row>
            <MenuButton type="button" value="←" onClick={this.doMinus} style={ { width: '20%', height: '100%', } }/>
            <span style={ { flex: 1, fontSize: `${fontScale(18)}px`, margin: 'auto', width: '100%', textAlign: 'center', } }>{ `${this.state.year}/${this.state.month}` }</span>
            <MenuButton type="button" value="→" onClick={this.doPlus} style={ { width: '20%', height: '100%', } }/>
          </Row>
        </div>
        <div style={ { height: '100%', overflow: 'auto', } }>
        {
          (this.props.account) ? this.props.account.map( (v, i) => ( <Item key={i} value={v} /> )) : null
        }
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    account: state.app.account,
  }),
  dispatch => ({
    loadAccount: (filter, callback) => dispatch( loadAccount(filter, callback) ),
    startLoading: (callback) => dispatch( startLoading(callback) ),
    stopLoading: (callback) => dispatch( stopLoading(callback) ),
  })
)(ListAccount);
