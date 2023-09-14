const msgform = document.getElementById('messageForm');
msgform.addEventListener('submit',sendMessage);

const token = localStorage.getItem('token');
console.log('TOKEN :', token);
const payload = token.split('.')[1];
const decodedPayload = window.atob(payload);
const decodedToken = json.parse(decodedPayload);

const username = decodedToken.name
const id = decodedToken.userId

// const token = localStorage.getItem('token');
// console.log('Token:', token);
// let username = ''; // Initialize username as an empty string
// let id = ''; // Initialize id as an empty string

// if (token) {
// //   const payload = token.split('.')[1];
//   const payload = token.split('.')
//   try {
//     const decodedPayload = window.atob(payload);
//     const decodedToken = JSON.parse(decodedPayload);
//     username = decodedToken.name;
//     id = decodedToken.userId;
//   } catch (error) {
//     console.error('Error decoding token:', error.message);
//   }
// }

function showOnScreen(details){
    const chatList = document.getElementById('chats');
    const chatItem = document.getElementById('li');
    chatItem.textContent = `${details.name}: ${details.message}`;
    chatList.appendChild(chatItem);
}

async function sendMessage(event){
    event.preventDefault();
    const details = {
        name : username,
        message : document.getElementById('message').value,
        userId : id
    };
    try{
        const response = await axios.post('http://localhost:2200/message/Chats',details,{
            headers:{'Authorization':token}
        });
        console.log('Message sent to the server:', response.data.details);

        showOnScreen(response.data.details);
        msgform.reset();
    }catch(error){
        console.log("Error in sending message",error.message);
    }
}

