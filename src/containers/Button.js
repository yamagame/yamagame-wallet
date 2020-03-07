import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fontSize } from '../reducers'

class Button extends Component {
  render() {
    const scale = this.props.fontScale || 1;
    return (
      <div className="Button-Container">
        <input className="Button-Key"
          type={this.props.type}
          value={this.props.value}
          onClick={this.props.onClick}
          style={ {fontSize: `${parseInt(this.props.fontSize*scale, 10)}px` }}
        />
      </div>
    )
  }
}

Button.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: fontSize({
    width: window.innerWidth,
    height: window.innerHeight,
  }),
}

export default connect(
  state => ({
    fontSize: state.app.fontSize,
    width: state.app.width,
    height: state.app.height,
  })
)(Button);
