import React, { Component } from 'react'
export default class ProfileB extends Component {
  render() {
  	if(this.props.children) return this.props.children
    return (
      <div>
        <h3>ProfileB</h3>
      </div>
    )
  }
}