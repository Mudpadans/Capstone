
const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('memberId')
        window.location.href = "/client/landing/index.html";
        }
    })

window.addEventListener('load', (event) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        eventLink.href = "/client/event/index.html";
        forumLink.href = "/client/forum/index.html";
    } else {
        eventLink.href = "/client/sign-up/index.html";
        forumLink.href = "/client/sign-up/index.html";
    }
})

