import React from 'react';
import './Chatroom.css';
import ContactList from './ContactList.js';
import Msgbox from './Msgbox.js';

const Msgs = [
  { 
    userInfo:{
      name:'MA9',
      profilePic:'https://goo.gl/1qhE6T',  
      isOnline:false,
      sId:'yyyyyyyyyyyyy'
    },
    messages:[
      //{message: 'HELLO WORLD', timestamp: '12:00', 'isFromMe': false},
      //{message: 'Hello Ma President!', timestamp: '12:01', 'isFromMe': true},
      //{message: 'Hi Bunch!', timestamp: '12:02', 'isFromMe': false},
    ],
  },
  {
    userInfo:{
      name:'Tsai En',
      profilePic:'https://goo.gl/1qhE6T',
      isOnline:false,
      sId:'xxxxxxxxxxxxxx'  
    },
    messages:[
      {message: 'LALALA', timestamp: '12:03', 'isFromMe': true},
      {message: 'Power with LOVE!', timestamp: '12:04', 'isFromMe': false}
    ],
  }
];
/*The shape of onlineUsers object
{
  socketId: sId,
  userName: signUpMsg.userName,
  profilePic:'https://goo.gl/1qhE6T'
}
*/
export default class Chatroom extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      threads: [],//Msgs,
      currentIdx: 0,
      onlineUsers:[],
      notifiedUser:""
    }
    
    this.addToMsgBox = this.addToMsgBox.bind(this);
    this.sendMessenge = this.sendMessenge.bind(this);

    
    this.props.socket.on('chat message', (msg) =>{
      msg.isFromMe = false;
      msg.isRead = false;
      //console.log(">>>>received msg:");
      //console.log(msg);
      this.setHtmlTitleByName(msg.fromUsr);
      this.setState({notifiedUser:msg.fromUsr});
      this.addToMsgBoxByName(msg);
    });
    this.props.socket.on('onlineList', (users) =>{
      console.log(users);
      this.setState({onlineUsers:users});
      this.linkOnlineUsersToThreads();
    });
    this.props.socket.emit('request for onlinelist', {});
  }
  setHtmlTitleByName = (name) =>{
    document.title = name + "sent you a message!";
  }
  linkOnlineUsersToThreads = () => {
      var threads = this.state.threads;
      var onlineUsrs = this.state.onlineUsers.map((usr)=>{
        usr.isMapped = false;
        return usr
      });
      for(let i = 0; i < onlineUsrs.length; i++){
        if(onlineUsrs[i].userName === this.props.username){
          onlineUsrs.splice(i, 1);
          break;
        }
      }
      console.log(">>> after slice");
      console.log(onlineUsrs);
      for (let i = 0; i < threads.length; i++){
        threads[i].userInfo.isOnline = false;
        for (let j = 0; j < onlineUsrs.length; j++){
          if(onlineUsrs[j].userName === threads[i].userInfo.name){
            threads[i].userInfo.isOnline = onlineUsrs[j].isOnline;
            threads[i].userInfo.sId = onlineUsrs[j].socketId;
            onlineUsrs[j].isMapped = true;
            break;
          }
        }
      }
      for (let i = 0; i < onlineUsrs.length; i++){
        if(onlineUsrs[i].isMapped === false){
          var newOnlineUsr = 
          {
            userInfo:{
              name:onlineUsrs[i].userName,
              profilePic:onlineUsrs[i].profilePic,
              isOnline:true, 
              sId: onlineUsrs[i].socketId  
            },
            messages:[],
          }
          threads.push(newOnlineUsr);
        }
      }
  }
  sendMessenge(msg){
    this.addToMsgBox(msg);
    let sId = this.state.threads[this.state.currentIdx].userInfo.sId;
    msg.sId = sId;
    msg.fromUsr = this.props.username;
    this.props.socket.emit('chat message', msg);
  }
  addToMsgBox(msg){
    const msgs = this.state.threads;
    
    msgs[this.state.currentIdx].messages.push(msg);
    this.setState({threads: msgs});
  }
  addToMsgBoxByName = (msg)=>{
    const msgs = this.state.threads;
    for(let i = 0; i < msgs.length; i++){
      if(msgs[i].userInfo.name === msg.fromUsr){
        msgs[i].messages.push(msg);        
      }
    }
    this.setState({threads: msgs});
  }
  getLastMsgByUserName = (usrname) =>{
    var lastMsg = "";
    var matchUsers = this.state.threads.filter((usr)=>{return usr.userInfo.name === usrname});
    if(matchUsers.length !==0){
      if(matchUsers[0].messages.length !== 0){
        lastMsg = matchUsers[0].messages[matchUsers[0].messages.length - 1].message;
      }else{
        lastMsg = "(No messages found.)";
      }
    }
   
    return lastMsg;
  }
  getLastIsReadByUserName = (usrname) =>{
    var lastIsRead = true;
    var matchUsers = this.state.threads.filter((usr)=>{return usr.userInfo.name === usrname});
    if(matchUsers.length !==0){
      if(matchUsers[0].messages.length !== 0){
        lastIsRead = matchUsers[0].messages[matchUsers[0].messages.length - 1].isRead;
      }
    }
    return lastIsRead;
  }
  // getOnlineList is depreciated method
  getOnlineList = () => {
    //XXX: It seems that I don't need ContactList.
    //console.log("+++++");
    //console.log(this.state.onlineUsers);
    //console.log("-----");
    var listInfo = this.state.onlineUsers.map((item) =>
      {
        var lMsg = this.getLastMsgByUserName(item.userName);

        var returnObj = {
          name: item.userName, 
          profilePic: item.profilePic, 
          //message:item.messages[item.messages.length - 1]
          message: lMsg
        }
        //console.log("HAHAHAHA+++"+ returnObj.message);
        return returnObj;
      }
    );
    //console.log(">>> ListInfo=");
    //console.log(listInfo);
    return listInfo;
  }
  getThreadsList = () => {
    var listInfo = this.state.threads.map((item) =>
      {
        var lMsg = this.getLastMsgByUserName(item.userInfo.name);
        //console.log(">>>> last message: " + lMsg);
        var returnObj = {
          name: item.userInfo.name, 
          profilePic: item.userInfo.profilePic, 
          message: lMsg,
          isOnline: item.userInfo.isOnline,
          isRead : this.getLastIsReadByUserName(item.userInfo.name)
        }
        return returnObj;
      }
    );
    return listInfo;
  }
  handleClickContactName = (name) =>{
    //console.log("+++++++++++++++++++++");
    //console.log(">>> Name " + name + "was clicked!");
    let idx = this.getCurrentIdxByName(name);
    this.setState({currentIdx: idx});
    this.setAllMsgsReadByCurrentIdx(idx);    
    //console.log(">>> curretIdx = " + this.getCurrentIdxByName(name));
  }
  getCurrentIdxByName = (name) =>{
    var thr = this.state.threads;
    for (let i = 0; i < thr.length; i++){
      if(thr[i].userInfo.name === name)return i;
    }
  }
  setAllMsgsReadByCurrentIdx = (currentIdx) => {
    let msgs = this.state.threads[currentIdx].messages;
    msgs = msgs.map((entry)=>{
      entry.isRead = true;
      return entry;
    });
    let thrs = this.state.threads;
    thrs[currentIdx].messages = msgs;
    this.setState({threads: thrs});
  }
  render(){
    var l = this.getThreadsList();
    if(this.getLastIsReadByUserName(this.state.notifiedUser)){
      document.title = "Chatroom";
    }
    if(l !== null){
      if(l.length !== 0){
        return (
          <div className="window">
            <ContactList userInfo={l} handleClickContactName={this.handleClickContactName}/>  
            <Msgbox userName={this.props.username} addMsg={this.sendMessenge} 
                    msgContent={this.state.threads[this.state.currentIdx]}
                    objectName={this.state.threads[this.state.currentIdx].userInfo.name} />
          </div>
        );
      }else{
        return (
          <div>Please wait for another user to join us...</div>
        );  
      }
    }else{
      return (
        <div>Please wait for a while...</div>
      );
    }
  }
}



