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
        await checkAdmin(groupId);
    }
}

async function sendMessage(event){
    event.preventDefault();
    const details = {
        name:username,
        userId:id,
        groupId:groupId,
        message : document.getElementById('message').value,
    };
    console.log("checking the details:",details)
    try{
        const response = await axios.post(`http://localhost:2200/groups/${groupId}/groupChat`,details,
        {
            headers:{'Authorization':token}
        }
        );
        console.log('Message sent to the server:', response);
        console.log(response.data.message);
        showOnScreen(response.data.newMessage);
        msgform.reset();
    }catch(error){
        console.log("Error in sending message",error.message);
    }
}

function showOnScreen(element){
    const chatList = document.getElementById('chats');
    const chatItem = document.createElement('li');
    chatItem.textContent = `${element.name} : ${element.message}`;
    chatList.appendChild(chatItem);
}

async function checkAdmin(groupId){
    try{
        const response = await axios.get(`http://localhost:2200/groups/${groupId}/checkAdmin`,
        {
            headers:{Authorization:token},
        });
        const admin =  response.data;
        console.log("Checking the admin",admin);
        if(admin===1){
            const showUsersButton = document.getElementById("showUsersButton");
            showUsersButton.style.display="block";
            showUsersButton.addEventListener("click",showUsers);

            const makeAdminButton = document.getElementById('makeAdminButton');
            makeAdminButton.style.display="block";
            makeAdminButton.addEventListener("click",makeAdmin);

            const removeUserButton=document.getElementById("removeUserFromGroup");
            removeUserButton.style.display = "block";
            removeUserButton.addEventListener("click",removeUser);
        }else{
            const makeAdminButton = document.getElementById("makeAdminButton");
            makeAdminButton.style.display="none";

            const removeUserButton=document.getElementById("removeUserFromGroup");
            removeUserButton.style.display="none";

            const showUsersButton = document.getElementById("showUsersButton");
            showUsersButton.style.display="none";
        }
    }catch(err){
        console.log("could not fetch admin",err.message);
    }
}

async function getMessages(groupId){
    // event.preventDefault();
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
            option.text = `${user.id} : ${user.name} : ${user.email} : ${user.mobile}`;                    
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

async function makeAdmin(){
    try{
        const dropdown = document.getElementById("MembersDropdown");
        const userId = dropdown.options[dropdown.selectedIndex].value;
        const details={
            userId:userId
        }
        console.log("Printing the details here:",details);

        const response = await axios.put(`http://localhost:2200/groups/${groupId}/makeAdmin`,
        {
            headers:{'Authorization':token},
        });
        console.log(response,"congratulations!!! You are an admin now")
    }catch(err){
        console.log("error in making an admin",err.message);
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
        option.text = `${user.id}:${user.userName}`;
        dropdown.appendChild(option);
    });
}

const groupDropdown = document.getElementById("groupDropdown");
groupDropdown.addEventListener("change",async(event)=>{
    const selectedGroupId = localStorage.getItem('groupId');
    groupId=selectedGroupId;
    await getMessages(groupId);
})

const removeUserButton = document.getElementById("removeUserFromGroup");
removeUserButton.style.display="block";
removeUserButton.addEventListener("click",removeUser);

async function removeUser(){
    const dropdown = document.getElementById('MembersDropdown');
    const userId= dropdown.options[dropdown.selectedIndex].value
    console.log('userId of the user that is to be deleted',userId);
    console.log("dropdown checking:",dropdown.selectedIndex);
    try{
        const details={
            userId : userId
        }
        const response = await axios.post(`http://localhost:2200/groups/${groupId}/removeUser`,details,
        {
            headers:{'Authorization':token}
        })
        console.log("printing response after removing the user",response);
    }catch(error){
        console.log("Error while deleting user : ",error)
    }
}