
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

let isLoggedIn = false;

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