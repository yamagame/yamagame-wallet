import React, { Component } from 'react';
import { connect } from 'react-redux'
import Row from './Row';
import MenuButton from './MenuButton';
import {
  loadAccount,
  saveAccount,
} from '../reducers'


function removeQuot(s) {
  const m = s.match(/\s*"(.*)"\s*/);
  if (m) {
    return removeQuot(m[1]);
  }
  return s;
}

function parseCSV(csv)
{
  const r = [];
  csv.split('\n').forEach( l => {
    const w = l.split(',');
    r.push({
      date: removeQuot(w[0]),
      debit: removeQuot(w[1]),
      credit: removeQuot(w[2]),
      value: removeQuot(w[3]),
      comment: removeQuot(w[4]),
    })
  })
  console.log(r);
  return r;
}

function makeCSV(json)
{
  const keys = ['date','debit','credit','value','commment'];
  let r = '';
  json.forEach( v => {
    if (r !== '') r += '\n';
    r += `${v.date},${v.debit},${v.credit},${v.value},\"${removeQuot(v.comment)}\"`;
  })
  return r;
}

class JsonEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: '',
    }
  }
  
  componentDidMount() {
    this.props.loadAccount(null, (data) => {
      data.map( v => {
        delete v.day;
        delete v.timestamp;
      })
      this.setState({
        csvData: makeCSV(data),
      })
    })
  }

  handleChange = (event) => {
    this.setState({csvData: event.target.value});
  }

  goBack = () => {
    try {
      this.props.saveAccount(parseCSV(this.state.csvData), () => {
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
          <textarea style={ { height: '100%', width: '100%', } } value={this.state.csvData} onChange={this.handleChange} />
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
