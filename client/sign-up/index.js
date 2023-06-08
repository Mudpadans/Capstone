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
        number: document.getElementById('#number').value
    }

    isLoggedIn = true;
})

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('login-email')

    if (email) {
        isLoggedIn = true;
        window.location.href = "/client/sign-up/index.html"
    } else {
        alert('Invalid Email')
    }
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