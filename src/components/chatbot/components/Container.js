import React, { Component } from 'react';
// import container from './container.css';
import { Card, Form, Button } from 'react-bootstrap'
import Conversation from './Conversation'
import Loading from './Loading'
import NewMessage from './NewMessage';
import axios from 'axios'
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ExampleContainer extends Component {

  state = {
    loading: false,
    messages: [
      {
        content: "Howdy there, partner! I'm Ubb, nice to meet you. You can ask me anything about personal finance. If you would like a list of topics that I can tell you about, type 'help'. Beep, boop, bop. 🤖",
        type: 'response'
      }, 
      {
        content: 'hey',
        type: 'send'
      }
    ],
    showBot: true,
    timer: 0
  }

  toggleBot = () => {
    this.setState({ showBot: !this.state.showBot })
  }

  listen = (e) => {
    window.addEventListener(e, this.stopTimer())
  }

  startTimer = () => {
   this.timer = setTimeout(() => {
    axios
      .post('http://localhost:8000/api/user_input/', { text: 'help' })
    this.apiCallGet()
   }, 60000)
  }

  stopTimer = () => {
    clearTimeout(this.timer)
  }

  componentDidMount() {
   this.startTimer()
  }
 
  loading = () => {
    this.setState({ loading: !this.state.loading })
  }

  apiCallGet = () => {
    axios
      .get('http://localhost:8000/api/')
      .then(res => this.newMessage(
        { 
          content: res.data,
          type: 'response'
        }
      )) 
  };

  newMessage = (message) => {
    let clone = this.state.messages.slice()
    let length = clone.length
    // add element to cloned array
    clone[length] = message
    this.setState({ messages: clone })
  }

  render() {
  
    const { showBot } = this.state;
    if (showBot) {
      return (
        <Card style={{ width: '25rem',
                       position: "absolute",
                       bottom: 0,
                       right: 10,
                       zIndex: 1000,
         }} id='chat-window' onClick={this.listen} onKeyPress={this.listen} onScroll={this.listen} >

          <Card.Header onClick={this.toggleBot} style={{cursor: 'pointer'}}> 🤖 ubb</Card.Header>
          <Card.Body>
            <Conversation messages={this.state.messages} />
            {/* { this.state.loading ? <Loading /> : null } */}
          </Card.Body>
          { this.state.loading ? <Loading /> : null }
          <Card.Footer>
            <NewMessage loading={this.loading} newMessage={this.newMessage} apiCallGet={this.apiCallGet} startTimer={this.startTimer} />
          </Card.Footer>
        </Card>
      )
    } else {
      return (
        <div
          style={{
            width: 450,
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 1000,
            fontSize: '50px',
            cursor: 'pointer',
          }}
        >
          <nav onClick={this.toggleBot}>
            <div id="chat-window-btn" data-toggle="chat-window" >
              <FontAwesomeIcon icon={faCommentDots} />
            </div>
          </nav>
        </div>
      )
    }

  }
}
