
const msgform = document.getElementById('messageForm');
msgform.addEventListener('submit',sendMessage);

const token = localStorage.getItem('token');
console.log('TOKEN :', token);
// const payload = token.split('.')[1];
// const decodedPayload = window.atob(payload);
// const decodedToken = JSON.parse(decodedPayload);

// const username = decodedToken.name
// const id = decodedToken.userId

function parseJwt(token){
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/");
    var jsonPayload = decodeURIComponent(
        window
        .atob(base64)
        .split("")
        .map(function (c){
            return "%" +("00" + c.charCodeAt(0).toString(16).slice(-2))
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
}

async function sendMessage(event){
    event.preventDefault();
    const details = {
        message : document.getElementById('message').value,
    };
    try{
        const response = await axios.post('http://localhost:2200/message/Chats',details,
        {
            headers:{'Authorization':token}
        }
        );
        console.log('Message sent to the server:', response.data.details);

        // Store the message data in localStorage
        showafterDomContentLoaded({
            name:response.data.name,
            message:response.data.message.message,
        });


        // setInterval(()=>{
        //     location.reload()
        // },1000);
        msgform.reset();
    }catch(error){
        console.log("Error in sending message",error.message);
    }
}


function showafterDomContentLoaded(element){
    const chatList = document.getElementById('chats');
    const chatItem = document.createElement('li');
    chatItem.textContent = `${element.name}: ${element.message}`;
    chatList.appendChild(chatItem);
}

window.onload = async function(){
    await getMessage();
}

async function getMessage(req,res,next){
    let lastmsg = localStorage.getItem("lastmsgg");
    if (!lastmsg){
        lastmsg=-1;
    }
    console.log("lastmsgg : ",lastmsg);
    try{
        // const response = await axios.get('http://localhost:2200/message/Chat',
        // {
        //     headers:{'Authorization':token}
        // });
        const response = await axios.get(`http://localhost:2200/message/Chat?lastmsg=${lastmsg}`,   
        {
            headers:{'Authorization':token}
        });
        const details = response.data.message;
        console.log("Getting messages from the server:",details);
        const chatList = document.getElementById("chats");
        chatList.innerHTML = "";
        console.log("Detailsss : ",details);
        lastmsg = details[details.length-1].id;
        localStorage.setItem("lastmsgg",lastmsg);
        if(details.length){
            let existingmsgs = JSON.parse(localStorage.getItem("message"));
            if (!existingmsgs){
                existingmsgs=[];
            }
            const newMessage = [...existingmsgs, ...details];
            while (newMessage.length > 10){
                newMessage.shift();
            }
            localStorage.setItem("message", JSON.stringify(newMessage));
        }
        const messages = JSON.parse(localStorage.getItem("message"));
        messages.forEach((element)=>{
            showafterDomContentLoaded(element);
        })

        // if(Array.isArray(details)){
        //     details.forEach((element)=>{
        //         showafterDomContentLoaded(element);
        //     });
        // }else{
        //     console.log("response.data.message is not an array");
        // }
    }catch(err){
        console.log("Error while getting messages:",err.message);
    }
}