import React, { Component } from 'react';
import MenuButton from './MenuButton';
import Row from './Row';
//import Column from './Column';
import { connect } from 'react-redux'
import {
  loadCategory,
  startLoading,
  stopLoading,
  fontScale,
} from '../reducers'

function Item({ title, onClick }) {
  return (
    <div className="Item-Container" onClick={ onClick }>
      <p style={ { margin: 8, padding: 8, height: fontScale(28), fontSize: `${fontScale(24)}px` } }> { title } </p>
    </div>
  )
}

class SelectItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'Assets',
    }
  }

  componentDidMount() {
    this.setState({
      category: this.props.value.category,
    }, this.loadCategory);
  }

  loadCategory = () => {
    this.props.startLoading(() => {
      this.props.loadCategory(this.state.category, () => {
        this.props.stopLoading();
      });
    });
  }

  selectItemHandler = (item) => {
    return () => {
      if (this.props.onSelect) {
        this.props.onSelect({
          category: this.state.category,
          name: item,
        });
      }
    }
  }

  selectCategoryHandller = (category) => {
    return () => {
      this.setState({
        category,
      }, this.loadCategory)
    }
  }

  render() {
    return (
      <div className="App">
        <div className="Item-Container">
          <Row>
            <span style={ { flex: 1, fontSize: `${fontScale(24)}px`, margin: 'auto', } }>{ this.props.title }</span>
            <MenuButton type="button" value="キャンセル" onClick={this.props.goBack} style={ { width: '40%', height: '100%', } }/>
          </Row>
        </div>
        <div style={ { height: '100%', overflow: 'auto', } }>
        {
          (this.props.category[this.state.category]) ? this.props.category[this.state.category].map( (v, i) => ( <Item key={i} title={v} onClick={ this.selectItemHandler(v) }/> )) : null
        }
        </div>
        <div>
          <Row>
            <MenuButton type="button" value="資産" onClick={this.selectCategoryHandller('Assets')} style={ { flex: 1, height: fontScale(64) } }/>
            <MenuButton type="button" value="負債" onClick={this.selectCategoryHandller('Liabilities')} style={ { flex: 1, height: fontScale(64) } }/>
            <MenuButton type="button" value="費用" onClick={this.selectCategoryHandller('Expenses')} style={ { flex: 1, height: fontScale(64) } }/>
            <MenuButton type="button" value="収益" onClick={this.selectCategoryHandller('Income')} style={ { flex: 1, height: fontScale(64) } }/>
            <MenuButton type="button" value="資本" onClick={this.selectCategoryHandller('Equity')} style={ { flex: 1, height: fontScale(64) } }/>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    fontSize: state.app.fontSize,
    category: state.app.category,
  }),
  dispatch => ({
    loadCategory: (category, callback) => dispatch( loadCategory(category, callback) ),
    startLoading: (callback) => dispatch( startLoading(callback) ),
    stopLoading: (callback) => dispatch( stopLoading(callback) ),
  })
)(SelectItem);
