import React, { Component } from 'react';
import { connect } from 'react-redux'
import Row from './Row';
import MenuButton from './MenuButton';
import {
  loadAccount,
  saveAccount,
} from '../reducers'

class JsonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: '',
    }
  }
  
  componentDidMount() {
    this.props.loadAccount(null, (data) => {
      console.log(data);
      this.setState({
        jsonData: JSON.stringify(data, null, '  '),
      })
    })
  }

  handleChange = (event) => {
    this.setState({jsonData: event.target.value});
  }

  goBack = () => {
    try {
      this.props.saveAccount(JSON.parse(this.state.jsonData), () => {
        this.props.goBack();
      });
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="App">
        {/*<p>{ window.innerWidth } { window.innerHeight } { window.devicePixelRatio }</p>*/}
        <div className="Item-Container">
          <Row>
            <MenuButton type="button" value="もどる" onClick={this.goBack} style={ { width: '40%', height: '100%', } }/>
          </Row>
        </div>
        <div style={ { height: '100%', overflow: 'auto', } }>
          <textarea style={ { height: '100%', width: '100%', } } value={this.state.jsonData} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
  }),
  dispatch => ({
    loadAccount: (filter, callback) => dispatch( loadAccount(filter, callback) ),
    saveAccount: (jsonData, callback) => dispatch( saveAccount(jsonData, callback) )
  })
)(JsonEditor);
