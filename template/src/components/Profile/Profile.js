import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'

export default withRouter(class Profile extends Component {
  render() {
  	if(this.props.children) return this.props.children
    return (
      <div>
        <h2>Profile</h2>
        <div><Link to="profile/a">ProfileA</Link></div>
        <div><Link to="profile/b">ProfileB</Link></div>
        <div><Link to="/">HOME</Link></div>
        <button onClick={this.gohome.bind(this)}>回到HOME</button>
      </div>
    )
  }
  gohome(){
  	this.props.router.push('/');  	
  }
  componentDidMount() {
  	console.log(this.props.router)
    this.props.router.setRouteLeaveHook(
      this.props.route, 
      this.routerWillLeave
    )
    this.props.router.listen(this.routerChange)
  }
  routerChange(){
  	console.log('routerChange')
  }
  routerWillLeave(){
  	console.log('routerWillLeave')
  }
})