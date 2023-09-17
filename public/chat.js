
const msgform = document.getElementById('messageForm');
msgform.addEventListener('submit',sendMessage);

const token = localStorage.getItem('token');
console.log('TOKEN :', token);
const payload = token.split('.')[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);

const username = decodedToken.name
const id = decodedToken.userId

window.onload=async function(){
    await getMessage();
}

function showOnScreen(details){
    const chatList = document.getElementById('chats');
    const chatItem = document.createElement('li');
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
        const response = await axios.post('http://localhost:2200/message/Chats',details,
        {
            headers:{'Authorization':token}
        }
        );
        console.log('Message sent to the server:', response.data.details);
        showOnScreen(response.data.details);
        msgform.reset();
    }catch(error){
        console.log("Error in sending message",error.message);
    }
}


async function getMessage(req,res,next){
    try{
        const response = await axios.get('http://localhost:2200/message/Chat',
        {
            headers:{'Authorization':token}
        });
        const details = response.data.message;
        console.log("Getting messages from the server:",details);
        const chatList = document.getElementById("chats");
        chatList.innerHTML = "";
        if(Array.isArray(details)){
            details.forEach((element)=>{
                showOnScreen(element);
            });
        }else{
            console.log("response.data.message is not an array");
        }
    }catch(err){
        console.log("Error while getting messages:",err.message);
    }
}