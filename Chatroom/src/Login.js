import React from 'react';
import Chatroom from './Chatroom';
import io from 'socket.io-client';
import ('./Login.css');


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted:false,  username: '' };

    // Bind 'this' to event handlers. React ES6 does not do this by default
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.usernameSubmitHandler = this.usernameSubmitHandler.bind(this);
    this.socket = io('http://localhost:5000');    
  }
  componentDidMount(){
    this.socket.on('login result', (result) =>{
      console.log(result);
      if((result.isOk === true) && (result.sId === this.socket.id)){
        this.setState({ submitted: true, username: this.state.username });
      }else{
        window.alert("Username has been used, please try another one!");
      } 
    });
  }
  usernameChangeHandler(event) {
    this.setState({ username: event.target.value });
  }

  usernameSubmitHandler(event) {
    event.preventDefault();
    this.socket.emit('sign up', {userName: this.state.username});
  }

  render() {
    
    if (this.state.submitted) {
      // Form was submitted, now show the main App
      return (
        <Chatroom username={this.state.username} socket={this.socket}/>
      );
    }else{
      document.title = "Chatroom";
      // Initial page load, show a simple login form
      return (
        <form onSubmit={this.usernameSubmitHandler} className="username-container">
          <h1>React Instant Chat</h1>
          <div>
            <input
              type="text"
              onChange={this.usernameChangeHandler}
              placeholder="Enter a username..."
              required />
          </div>
          <input type="submit" value="Submit" />
        </form>
      );
    }

    
  }

}


export default Login;