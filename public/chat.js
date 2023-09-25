
const msgform = document.getElementById('messageForm');
msgform.addEventListener('submit',sendMessage);

const createGroupButton = document.getElementById('createGroup');
createGroupButton.addEventListener('click',createGroup);

window.onload = async function(){
    await getMessage();
    showAllGroups();
}

const token = localStorage.getItem('token');
console.log('TOKEN :', token);
const payload = token.split('.')[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);

const username = decodedToken.name
const id = decodedToken.userId

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
        // showafterDomContentLoaded({
        //     name:response.data.name,
        //     message:response.data.message.message,
        // });


        setInterval(()=>{
            location.reload()
        },1000);
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

async function getMessage(req,res,next){
    let lastmsg = localStorage.getItem("lastmsgg");
    if (!lastmsg){
        lastmsg=-1;
    }
    console.log("lastmsgg : ",lastmsg);
    try{
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
        // if(!details.length){
        //     console.log("No messages yet")
        // }else{
        //     lastmsg = details[details.length-1].id;
        //     localStorage.setItem("lastmsgg",lastmsg);
        // }
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

async function createGroup(event){
    event.preventDefault();
    console.log("entered the function creategroup");
    const groupName = prompt('Enter the group name ');
    console.log("CHECKING THE GROUP NAME IN CREATE GROUP :",groupName);
    if (groupName === "") {
        messageHandler("Please Enter the name", "error");
      } else {
        const postDetails = {
          groupName: groupName,
        };
        console.log("group name in js", postDetails);
    
    try{
        const response = await axios.post('http://localhost:2200/message/group',{name:groupName},{
            headers:{'Authorization':token},
        });

        if(response.status===401){
            console.log("group already exists")
        }else{
            const groupId = response.data.groupId;
        console.log("Checking the groupID : ",groupId);

        console.log("checking the message : ", response.data.message);
        location.reload();
        }
        }catch(error){
        console.log('Error creating the group ',error.message);
    }
}
}

// async function showAllGroups(){
//     try{
//         const response = await axios.get('http://localhost:2200/message/group',{
//             headers:{'Authorization':token}
//         });
//         console.log("checking the response in showallGroups:",response);
//         const groups = response.data.groups;
//         console.log("Consoling the groups : ",groups);
//         const groupList = document.getElementById('group-list');
//         // console.log("COnsoling the group list in showallgroups:",groupList);
//         groupList.innerHTML='';                                                                            

//         if(Array.isArray(groups)){
//             groups.forEach((group)=>{
//                 const listItem = document.createElement('li');
//                 const link = document.createElement('a');
//                 link.textContent = `${group.groupName}`;
//                 link.href = `group.html`;
//                 link.setAttribute('id',group.groupId);
//                 listItem.appendChild(link);
//                 groupList.appendChild(listItem);
    
//                 link.addEventListener('click',function(event){
//                     event.preventDefault();
//                     const groupName = group.groupName;
//                     console.log("Printing the group name here : ",groupName);
    
//                     const groupId = link.getAttribute('id');
//                     console.log("Printing the groupId here : ",groupId);
//                     localStorage.setItem('groupId',groupId);
//                     localStorage.setItem('groupName',groupName);
    
//                     window.location.href = `group.html`;
//                 });
//             })
//         }else{
//             console.log("groups is not an array");
//         }  
//     }catch(error){
//         console.log("Error in fetching the groups",error.message);
//     }
// }

async function showAllGroups() {
    try {
      const response = await axios.get('http://localhost:2200/message/group', {
        headers: { 'Authorization': token }
      });
      console.log(response, "consoling response")
      const groupList = document.getElementById('group-list');
      groupList.innerHTML = '';
      
  
      const groups = response.data;
      console.log(groups, " consoling the groups")
      groups.forEach(group => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = `${group.groupName}`;
        link.href = `group.html`
        link.setAttribute('id',group.groupId)
        listItem.appendChild(link);
        groupList.appendChild(listItem);
        
        link.addEventListener('click', function (event) {
          event.preventDefault();
          const groupName = group.groupName;
          console.log(groupName,"printing group name here")
          
          const groupId = link.getAttribute('id'); 
          console.log(groupId, "printing to check group id in seq")
          console.log(groupId," checking for the id")
          localStorage.setItem('groupId', groupId);
          localStorage.setItem('groupName', groupName)
  
          window.location.href = `group.html`; 
        });
      });
    } catch (error) {
      console.log('Error fetching groups:', error);
    }
  }