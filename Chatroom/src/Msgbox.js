import React from 'react';
import './Msgbox.css';

export default class Msgbox extends React.Component{
  constructor(props){
    super(props);
    this.state = {myName:this.props.userName};
    this.submitMessage = this.submitMessage.bind(this);
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  submitMessage(e, txt){
    e.preventDefault();
    this.props.addMsg({
      message:txt,
      timestamp:new Date().toString(), 
      isFromMe:true,
      isRead:true
    });
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }  
  render(){
    var msgs = this.props.msgContent.messages;
    var list = [];
    
    for (let i = 0; i < msgs.length; i++){
      list.push(<MsgEntry key={msgs[i].timestamp} isFromMe={msgs[i].isFromMe} message={msgs[i].message} timestamp={msgs[i].timestamp}/>)
    }
    var Btn= <MsgInput submitMessage={this.submitMessage}/>;
    if(this.state.myName === this.props.objectName){
      Btn = <div>Waiting for another online user...</div>
    }else{
      Btn = <MsgInput submitMessage={this.submitMessage}/>;
    }
    return (
      <div className="windowCol msgbox">
        <div className="talkingObject">{this.props.objectName}</div>
        <div className="msgEntries message-list">
          {list}
          <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        {Btn}
      </div>
    );
  }
}

class MsgEntry extends React.Component{
  render(){
    return (
      <div className={`msgEntry ${this.props.isFromMe ? 'message-from-me' : 'message-from-the-other'}`}>
        <span>
        {this.props.message}
        </span>
      </div>
    );
  }
}

class MsgInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {value: ""};
    this.handleChange = this.handleChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value}); 
  }

  submitMessage(e){
    this.props.submitMessage(e, this.state.value);
    this.setState({value: ""});
  }
  render(){
    return (
      <form className="input" onSubmit={(e)=> this.submitMessage(e)}>
        <input value={this.state.value} type="text" onChange={this.handleChange}/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}