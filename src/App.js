import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  AddAccount,
  SelectItem,
  ListAccount,
} from './containers';
import {
  changeLayout,
  setParams,
  addDeal,
  startLoading,
  stopLoading,
} from './reducers';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'add-account',
      value: '',
      comment: '',
    }
  }

  onResize = () => {
    this.props.onLayout({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  gotoList = () => {
    this.setState({
      state: 'list-account',
    });
  }

  openDebit = () => {
    this.setState({
      state: 'select-debit',
    });
  }

  openCredit = () => {
    this.setState({
      state: 'select-credit',
    });
  }

  cancelSelectItem = () => {
    this.setState({
      state: 'add-account',
    });
  }

  replaceCategory = () => {
    this.props.setParams({
      debit: this.props.credit,
      credit: this.props.debit,
    });
  }

  changeValue = (value) => {
    this.props.setParams({
      value,
    });
  }

  changeComment = (comment, callback) => {
    this.props.setParams({
      comment,
    }, callback);
  }

  selectDebit = (debit) => {
    this.props.setParams({ debit });
    this.setState({
      state: 'add-account',
    });
  }

  selectCredit = (credit) => {
    this.props.setParams({ credit });
    this.setState({
      state: 'add-account',
    });
  }

  addDeal = (callback) => {
    this.props.startLoading(() => {
      this.props.addDeal({
        value: this.props.value,
        credit: this.props.credit,
        debit: this.props.debit,
        comment: this.props.comment,
      }, () => {
        this.props.stopLoading();
        this.changeValue('');
        this.changeComment('');
        if (callback) callback();
      });
    });
  }

  render() {
    return (
      <div style={ { height: '100%', } }>
        {
          this.renderContent()
        }
        {
          (this.props.loading) ? <div style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }} /> : null
        }
      </div>
    )
  }

  renderContent() {
    if (this.state.state === 'add-account') {
      return (
        <AddAccount
          value={this.props.value}
          comment={this.props.comment}
          onChange={this.changeValue}
          addDeal={this.addDeal}
          gotoList={this.gotoList}
          selectDebit={this.openDebit}
          selectCredit={this.openCredit}
          replaceCategory={this.replaceCategory}
          onChangeComment={this.changeComment}
        />
      );
    }
    if (this.state.state === 'select-debit') {
      return (
        <SelectItem
          title="借り方"
          value={this.props.debit}
          goBack={this.cancelSelectItem}
          onSelect={this.selectDebit}
        />
      );
    }
    if (this.state.state === 'select-credit') {
      return (
        <SelectItem
          title="貸し方"
          value={this.props.credit}
          goBack={this.cancelSelectItem}
          onSelect={this.selectCredit}
        />
      );
    }
    if (this.state.state === 'list-account') {
      return (
        <ListAccount
          title="取引"
          goBack={this.cancelSelectItem}
        />
      );
    }
    return (
      <div />
    )
  }
}

export default connect(
  state => ( {
    debit: state.app.debit,
    credit: state.app.credit,
    loading: state.app.loading,
    value: state.app.value,
    comment: state.app.comment,
  } ),
  dispatch => ( {
    onLayout: (size) => dispatch( changeLayout(size) ),
    setParams: (params, callback) => dispatch( setParams(params, callback) ),
    addDeal: (deal, callback) => dispatch( addDeal(deal, callback) ),
    startLoading: (callback) => dispatch( startLoading(callback) ),
    stopLoading: (callback) => dispatch( stopLoading(callback) ),
  })
)(App);
