import React, { Component } from 'react';
import { connect } from 'react-redux'
import Button from './Button';
import MenuButton from './MenuButton';
import Row from './Row';
import Column from './Column';
import { fontSize, fontScale, } from '../reducers'
import { CategoryName, } from '../reducers/localstore'

class AddAccount extends Component {

  numberKeyHandller = (key) => {
    return () => {
      if (key === 'add') {
        if (this.props.onChangeComment) {
          this.props.onChangeComment(this.inputComment.value, () => {
            if (this.props.addDeal) this.props.addDeal(() => {
              this.inputComment.value = '';
            });
          });
        }
      } else
      if (key === 'list') {
        if (this.props.gotoList) this.props.gotoList();
      } else
      if (key === 'cls') {
        this.props.onChange('');
      } else
      if (key === 'del') {
        this.props.onChange(this.props.value.slice(0, -1));
        // this.setState({ value: this.state.value.slice(0, -1) });
      } else {
        if ((key === '0' || key === '00') && this.props.value === '') return;
        this.props.onChange(this.props.value+key);
        // this.setState({ value: this.state.value+key });
      }
    }
  }

  selectDebit = () => {
    if (this.props.selectDebit) this.props.selectDebit();
  }

  selectCredit = () => {
    if (this.props.selectCredit) this.props.selectCredit();
  }

  replaceCategory = () => {
    if (this.props.replaceCategory) this.props.replaceCategory();
  }

  changeComment = (e) => {
    if (this.props.onChangeComment) this.props.onChangeComment(e.target.value);
    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <Row style={ { flex:2 } }>
          <Column>
            <Row>
              {
                <div className="App-Column" style={ { width: '100%' } }>
                  <span className="Category" style={ { fontSize: fontScale(24), } }>{CategoryName(this.props.debit.category)}</span>
                  <MenuButton type="button" value={this.props.debit.name} onClick={this.selectDebit} style={{ flex: 1 }} />
                </div>
              }
            </Row>
          </Column>
          <MenuButton type="button" value="⇄" style={{ height: '100%', width: fontScale(60) }} onClick={this.replaceCategory} />
          <Column>
            <Row>
              {
                <div className="App-Column" style={ { width: '100%' } }>
                  <span className="Category" style={ { fontSize: fontScale(24), } }>{CategoryName(this.props.credit.category)}</span>
                  <MenuButton type="button" value={this.props.credit.name} onClick={this.selectCredit} style={{ flex: 1 }} />
                </div>
              }
            </Row>
          </Column>
        </Row>
        <input type="text" value={this.props.value} style={ { flex: 2, fontSize: this.props.fontSize,  }} readOnly/>
        <input ref={(input)=>{this.inputComment = input}} type="text"style={ { flex: 1, fontSize: fontScale(24),  }}/>
        {/*
        <input type="text" value={this.props.comment} style={ { flex: 1, fontSize: fontScale(24),  }} onChange={this.changeComment}/>
        */}
        <Row style={ { flex:2 } }>
          <Button type="button" value="1" onClick={this.numberKeyHandller('1')} />
          <Button type="button" value="2" onClick={this.numberKeyHandller('2')} />
          <Button type="button" value="3" onClick={this.numberKeyHandller('3')} />
          <Button type="button" value="C" onClick={this.numberKeyHandller('cls')} />
        </Row>
        <Row style={ { flex:2 } }>
          <Button type="button" value="4" onClick={this.numberKeyHandller('4')} />
          <Button type="button" value="5" onClick={this.numberKeyHandller('5')} />
          <Button type="button" value="6" onClick={this.numberKeyHandller('6')} />
          <Button type="button" value="削除" onClick={this.numberKeyHandller('del')} />
        </Row>
        <Row style={ { flex:4 } }>
          <Column style={ { flex:3 } }>
            <Row>
              <Button type="button" value="7" onClick={this.numberKeyHandller('7')} />
              <Button type="button" value="8" onClick={this.numberKeyHandller('8')} />
              <Button type="button" value="9" onClick={this.numberKeyHandller('9')} />
            </Row>
            <Row>
              <Button type="button" value="0" onClick={this.numberKeyHandller('0')} style={ { flex:2 } }/>
              <Button type="button" value="00" onClick={this.numberKeyHandller('00')} style={ { flex:1 } }/>
            </Row>
          </Column>
          {
            (this.props.value==='') ? 
            <Button type="button" value="一覧" onClick={this.numberKeyHandller('list')} style={ { flex:1 } }/>
            : <Button type="button" value="追加" onClick={this.numberKeyHandller('add')} style={ { flex:1 } }/>
          }
        </Row>
      </div>
    );
  }
}

AddAccount.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  debit: {},
  credit: {},
  comment: '',
  value: '',
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
}

export default connect(
  state => {
    return {
      debit: state.app.debit,
      credit: state.app.credit,
      fontSize: state.app.fontSize,
      value: state.app.value,
      comment: state.app.comment,
      width: state.app.width,
      height: state.app.height,
    }
  }
)(AddAccount);
