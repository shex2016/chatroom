import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import './ContactList.css';
export default class ContactList extends React.Component{
  
  render(){
    /*
    var list = [
      {name: 'Bunch Lin'}, 
      {name: 'Alex Chang'}
    ];*/
    var list = this.props.userInfo;
    console.log(">>> list: ", list);
    var rows = list.map((info)=>
      <Contact key={info.name} name={info.name} profilePic={info.profilePic} 
                message={info.message} isOnline={info.isOnline}
                handleClickContact={this.props.handleClickContactName}
                isRead={info.isRead}/>
    );
    return (
      <div className="windowCol contactList">
        <h3 className="messenger-title">Messenger</h3>
        {rows}
      </div>
    );
  }
}

class Contact extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      readStatus : this.props.isRead ? "": "unread"
    }
  }
  render (){
    var lastMsg = this.props.message;
    var rStatus = this.props.isRead ? "": "unread";
    var avatarStyle = {
      margin: 5
    }
    if(this.props.isOnline)avatarStyle.border = '2px solid green';
    console.log(">>>> rStatus = " + this.props.isOnline);
    return (
      <div className={"contact-item " + rStatus} onClick={() =>{this.props.handleClickContact(this.props.name)}}>
        <div className="contact-left">
          <Avatar
            alt="Adelle Charles"
            src={this.props.profilePic}
            className="bigAvatar"
            style={avatarStyle}
          />
        </div>
        <div className="contact-right">
          <div className="contact-name">
            {this.props.name}
          </div>
          {lastMsg}
        </div>
        
      </div>
    );
  }
}
