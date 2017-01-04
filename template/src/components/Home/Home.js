import React, { Component } from 'react'
import { Link } from 'react-router'

export default class App extends Component {
  render() {
    if(this.props.children){
      return this.props.children
    }
    return (
      <div>
        <header>我是HOME页</header>
        <div>
          <div><Link to="/profile">profile</Link></div>
        </div>
      </div>
    )
  }
}