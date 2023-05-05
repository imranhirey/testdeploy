const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const typingMessage = document.getElementById('typing-message')
const registerForm = document.querySelector('.register form')
const app = document.querySelector('.app');

// Play sound if message is received
  const audio = new Audio('http://localhost:3002/pip.wav');


  
  let active = true;
  const name = localStorage.getItem('name');
  
  if (name === null) {
    app.classList.add('hide');
    registerForm.parentElement.classList.remove('hide');
    active = false;
  } else {
    app.classList.remove('hide');
    registerForm.parentElement.classList.add('hide');
  }
  
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = registerForm.querySelector('#name');
    if (nameInput.value.length > 0) {
      localStorage.setItem('name', nameInput.value);
      active = true;
      app.classList.remove('hide');
      registerForm.parentElement.classList.add('hide');
    }
  });





function App (){
  appendMessage('You joined', true)
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name} : ${data.message}`, false)
  typingMessage.innerText = ''
})

socket.on('user-connected', name => {
  const messageId = Date.now().toString()
  appendMessage(`${name} : joined the room`, false, messageId)
})

socket.on('user-disconnected', name => {
  const messageId = Date.now().toString()
  appendMessage(`${name} : Leaved the room`, false, messageId)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  if (message.length >0){
    appendMessage(`You: ${message}`, true)
    socket.emit('send-chat-message', message)
  
  }
  messageInput.value = ''
  typingMessage.innerText = ''
})

messageInput.addEventListener('input', () => {
  if (messageInput.value) {
    socket.emit('typing')
  } else {
    socket.emit('stop-typing')
  }
})

socket.on('typing', name => {
  typingMessage.innerText = `${name} is typing...`
})

socket.on('stop-typing', () => {
  typingMessage.innerText = ''
})

function appendMessage(message, isSent, messageId) {
  const messageElement = document.createElement('div')
  messageBox = document.createElement('div') 
  messageBox.classList.add('messageSec')
  messageElement.innerText = message
  messageElement.classList.add('message')
  if (isSent) {
    messageElement.classList.add('sent')
    messageBox.classList.add('right')
  } else {
    messageElement.classList.add('received')
    messageBox.classList.add('left')
    audio.play();
  }
  if (messageId) {
    messageElement.id = messageId
  }
  messageBox.append(messageElement)
  messageContainer.append(messageBox)
  messageContainer.scrollTop = messageContainer.scrollHeight;

}
}

if (active){
  App()
  registerForm.classList.add('hide')
}