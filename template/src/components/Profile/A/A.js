import React, { Component } from 'react'
export default class ProfileA extends Component {
  render() {
  	if(this.props.children) return this.props.children
    return (
      <div>
        <h3>ProfileA</h3>
      </div>
    )
  }
}