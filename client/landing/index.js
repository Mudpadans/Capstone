
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('memberId')
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/landing/index.html";
        }
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

