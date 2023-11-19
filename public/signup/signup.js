let signupForm = document.getElementById("signupform");
signupForm.addEventListener("submit",signup);
async function signup(e){
    e.preventDefault();
    const signupdetails = {
        name: e.target.name.value,
        email: e.target.email.value,
        mobile:e.target.mobile.value,
        password: e.target.password.value,
    };
    try{
        const response = await axios.post(
            "http://localhost:2200/user/signup",
            signupdetails
        );
        console.log("signupdetails,",signupdetails);
        console.log(response,"response");
        if(response.status === 201){
            alert(response.data.name);
            window.location.href = '../login/login.html';
        }
    }catch(err){
        console.log(err.message);
        // alert("User already signed up. Please go to login page",err.message);
        // window.location.href = '../login/login.html';
    }
}