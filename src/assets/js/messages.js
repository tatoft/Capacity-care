document.getElementById('messageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sender_id = localStorage.getItem('userId'); // ID del usuario autenticado desde el localStorage
    const receiver_id = document.getElementById('receiver_id').value; // ID del usuario seleccionado
    const message_content = document.getElementById('message_content').value;

    try {
        const response = await fetch('/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sender_id, receiver_id, message_content })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('message_content').value = '';
            loadConversation(receiver_id); // Cargar la conversación inmediatamente
        } else {
            alert(data.error || 'Error desconocido');
        }
    } catch (error) {
        alert('Error al enviar el mensaje');
    }
});

async function loadUsers() {
    const response = await fetch('/api/v1/users');
    const users = await response.json();

    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user.name;
        userElement.classList.add('p-2', 'bg-blue-400', 'rounded-sm','hover:bg-blue-300'); // Añadir clases
        userElement.addEventListener('click', () => {
            document.getElementById('receiver_id').value = user._id;
            loadConversation(user._id);
            startPolling(user._id); // Iniciar el polling cuando se selecciona un usuario
        });
        userList.appendChild(userElement);
    });
}

async function loadConversation(receiverId) {
    const senderId = localStorage.getItem('userId');
    const response = await fetch(`/messages/conversation/${senderId}/${receiverId}`);
    const messages = await response.json();

    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('p-2', 'rounded', 'mb-2');
        if (message.sender_id._id === senderId) {
            messageElement.classList.add('bg-blue-200', 'text-right');
        } else {
            messageElement.classList.add('bg-gray-200', 'text-left');
        }
        messageElement.textContent = `${message.sender_id.name}: ${message.message_content}`;
        messagesList.appendChild(messageElement);
    });
}

function startPolling(receiverId) {
    if (window.pollingInterval) {
        clearInterval(window.pollingInterval);
    }
    window.pollingInterval = setInterval(() => loadConversation(receiverId), 3000);
}

loadUsers();
