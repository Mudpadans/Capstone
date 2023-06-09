const axios = require('axios');
const signupForm = document.getElementById("signup-form")
const loginForm = document.getElementById("login-form")
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
let isLoggedIn = false;

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let formData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        dj: document.getElementById('dj').value,
        email: document.getElementById('email').value,
        number: document.getElementById('number').value
    }

    axios.post("http://localhost:4200/members", formData).then(res => {
        console.log(res.data);
    }).catch(err => console.log(err))

    isLoggedIn = true;
})

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('login-email').value;

    axios.post("http://localhost:4200/authenticateMember", {email})
        .then(res => {
            if (res.data.status === "Authenticated") {
                isLoggedIn = true;
                window.location.href = "/client/sign-up/index.html"
            } else {
                alert('Invalid Email')
            }
    }).catch(err => console.log(err))
})

eventLink.addEventListener('click', (event) => {
    if (!isLoggedIn) {
        event.preventDefault();
        window.location.href = "/client/sign-up.index.html";
    }
});

forumLink.addEventListener('click', (event) => {
    if (!isLoggedIn) {
        event.preventDefault();
        window.location.href = "/client/sign-up/index.html";
    }
})