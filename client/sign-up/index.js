const signupForm = document.getElementById("signup-form")
const loginForm = document.getElementById("login-form")
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logut-link")

let isLoggedIn = false;

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let formData = {
        fname: document.getElementById('fname').value,
        lname: document.getElementById('lname').value,
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        email: document.getElementById('signup-email').value,
        number: document.getElementById('number').value
    }

    axios.post("http://localhost:4200/members", formData).then(res => {
        console.log(res.data);
    }).catch(err => console.log(err))

    isLoggedIn = true;

    localStorage.setItem('isLoggedIn', 'true');
})

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('login-email').value;

    axios.post("http://localhost:4200/authenticateMember", {email})
        .then(res => {
            if (res.data.status === "Authenticated") {
                isLoggedIn = true;
                window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html"
            } else {
                alert('Invalid Email')
            }
    }).catch(err => console.log(err))

    localStorage.setItem('isLoggedIn', 'true');
})

eventLink.addEventListener('click', (event) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        event.preventDefault();
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
    }
});

forumLink.addEventListener('click', (event) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        event.preventDefault();
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
    }
})

logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        axios.post('http://localhost:4200/logout')
            .then(res => {
                if(res.data.status === "Logged out") {
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/landing/index.html";
                    location.reload(true);
                }
            }).catch(err => console.log(err))
    }
})

window.addEventListener('load', (event) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        eventLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
        forumLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
    }
})