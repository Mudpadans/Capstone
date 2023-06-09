let isLoggedIn = false;

const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

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
    if (localStorage.getItem('isLoggedIn') === 'true') {
        event.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/landing/index.html";
    }
})