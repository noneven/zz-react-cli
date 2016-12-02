import React, { Component } from 'react'
import { Link } from 'react-router'

export default class App extends Component {
  render() {
  	if(this.props.children){
  		return this.props.children
  	}
    return (
      <div>
        我是HOME页
        <div>
	        <div><Link to="/grades">grades</Link></div>
	        <div><Link to="/messages">messages</Link></div>
	        <div><Link to="/profile">profile</Link></div>
        </div>
      </div>
    )
  }
}
