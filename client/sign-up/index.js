const signupForm = document.getElementById("signup-form")
const loginForm = document.getElementById("login-form")
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link");

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
        localStorage.setItem('isLoggedIn', 'true')
    }).catch(err => console.log(err))
})

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('login-email').value;

    axios.post("http://localhost:4200/authenticateMember", {email})
        .then(res => {
            if (res.data.status === "Authenticated") {
                alert('you are logged in!');
                localStorage.setItem('memberId', res.data.memberId);
                localStorage.setItem('isLoggedIn', 'true');
            } else {
                alert('Invalid Email')
            }
    }).catch(err => console.log(err))
})

window.addEventListener('load', (event) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        eventLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/event/index.html";
        forumLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/forum/index.html";
    } else {
        eventLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
        forumLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
    }
})

logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('memberId')
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/landing/index.html";
        }
    })


