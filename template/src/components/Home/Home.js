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
          <div><Link to="/login">Login</Link></div>
          <div><Link to="/messages">messages</Link></div>
          <div><Link to="/profile">profile</Link></div>
        </div>
        <ul>
          <li><div className="icon-address"></div></li>
          <li><div className="icon-auth"></div></li>
          <li><div className="icon-comment"></div></li>
          <li><div className="icon-first"></div></li>
          <li><div className="icon-like"></div></li>
          <li><div className="icon-liked"></div></li>
          <li><div className="icon-post_btn"></div></li>
          <li><div className="icon-star"></div></li>
          <li><div className="icon-third"></div></li>
          <li><div className="icon-want"></div></li>
          <li><div className="icon-wanted"></div></li>
        </ul>
      </div>
    )
  }
}