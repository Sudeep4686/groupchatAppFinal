const token = localStorage.getItem('token');
const payload = token.split(".")[1];
const decodedPayload = window.atob(payload);
const decodedToken = JSON.parse(decodedPayload);

const username = decodedToken.name;
const id = decodedToken.userId;

const groupId = localStorage.getItem('groupId');
const groupName = localStorage.getItem('groupName');

const msgform = document.getElementById('groupMessageForm');
msgform.addEventListener('submit',sendMessage);

window.onload = async function (){
    if (groupId){
        await getMessages(groupId);
        await getGroupMembers(groupId);
    }
}

async function sendMessage(event){
    event.preventDefault();
    const details={
        name:username,
        message:document.getElementById("message").value,
        userId:id,
        groupId:groupId,
    };
    try{
        const response=await axios.post(`http://localhost:2200/groups/${groupId}/groupChat`,
        details,
        {
            headers:{Authorization:token},
        });
        console.log("Message data sent to the server:",response.data.details);
        showOnScreen(response.data.details);
        msgform.reset();
    }catch(error){
        console.log("Error in sending the message in group:",error.message)
    }
} 

function showOnScreen(details){
    const chatList=document.getElementById("chats");
    const chatItem = document.getElementById("li");
    chatItem.textContent=`${details.name}:${details.message}`;
    chatList.appendChild(chatItem);
}

async function getMessages(groupId){
    event.preventDefault();
    try{
        const response = await axios.get(`http://localhost:2200/groups/${groupId}/groupChat`,
        {
            headers:{Authorization:token},
        });
        console.log("checking the response from server:",response);
        const details = response.data.messages;
        console.log("checking for details:",details);
        const chatList=document.getElementById("chats");
        chatList.innerHTML="";

        if(details){
            details.forEach((element)=>{
                showOnScreen(element);
            })
        }
    }catch(err){}
}

const showUsersButton = document.getElementById("showUsersButton");
showUsersButton.style.display="block";
showUsersButton.addEventListener("click",showUsers);

async function showUsers(req,res){
    try{
        const response = await axios.get('http://localhost:2200/groups/userlist',
        {
            headers:{'Authorization':token},
        });
        console.log("Printing response here for userlist : ",response)
        const userList = response.data;
        const dropdown = document.getElementById('userList');
        dropdown.innerHTML = "";

        userList.forEach((user)=>{
            const option = document.createElement('option');
            option.value = user.id;
            option.text = `${user.id} : ${user.name} : ${user.email} : ${user.phone}`;
            dropdown.appendChild(option);
        });
        dropdown.selectdIndex = 0;

        dropdown.addEventListener('change',async(event)=>{
            const selectedUserId = event.target.value;
            const selectedUserName = event.target.options[event.target.selectdIndex].text.split(' : ')[0];
            try{
                const details={
                    groupId : localStorage.getItem('groupId'),
                    userId:selectedUserId,
                    groupName:localStorage.getItem('groupName'),
                    userName : selectedUserName,
                };
                console.log("Checking for groupname : ",details);
                const addResponse = await axios.post('http://localhost:2200/groups/adduser',details,{
                    headers:{'Authorization':token},
                });
                console.log("Adding user to the group : ",addResponse.data);
                dropdown.style.display='none';
            }catch(addError){
                console.log("Error adding user to group : ",addError);
            }
        });

        dropdown.style.display = 'block';
        dropdown.dispatchEvent(new Event('change'));
    }catch(error){
        console.log('Error fetching user list:',error);
    }
}

async function getGroupMembers(){
    try{
        const response=await axios.get(`http://localhost:2200/groups/${groupId}/groupMembers`,
        {
          headers: { Authorization: token },
        });
        console.log("Printing group member details here :",response);
        MembersDropdown(response.data);
    }catch(err){
        console.log("Error in getting group members : ",err)
    }
}

function MembersDropdown(groupMembers){
    const dropdown= document.getElementById("MembersDropdown");
    dropdown.innerHTML="";
    groupMembers.forEach((user)=>{
        const option = document.createElement("option");
        option.value=user.userId;
        option.text = `${user.id}:${user.NameOfUser}`;
        dropdown.appendChild(option);
    });

    const groupDropdown = document.getElementById("groupDropdown");
    groupDropdown.addEventListener("change",async(event)=>{
        const selectedGroupId = localStorage.getItem('groupId');
        groupId=selectedGroupId;
        await getMessages(groupId);
    })
}