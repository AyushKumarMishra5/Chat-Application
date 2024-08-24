const socket = io('http://localhost:3000');

function promptForName() {
    let name = prompt("Enter a name to get in the chat room.");
    while (!name || name.trim() === "") {
        name = prompt("Please enter a valid name to get in the chat room.");
    }
    return name;
}

const name = promptForName();
socket.emit('new-user', name);

const messageForm = document.getElementById('send-container');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');

appendMessage('You Joined the chat room', 'system-message');

socket.on('chat-message', data => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    
    if (data.name === name) {
        messageElement.classList.add('owner');
    } else {
        messageElement.classList.add('user');
    }
    
    messageElement.innerHTML = `
        <span class="name">${data.name}:</span>
        <span class="message">${data.message}</span>
    `;
    
    messageContainer.appendChild(messageElement);
});

socket.on('user-connected', name => {
    appendMessage(`${name} Joined`, 'user-connected');
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

function appendMessage(message, className = '') {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = message;

    if (className) {
        messageElement.classList.add(className);
    }

    messageContainer.append(messageElement);
}
