let isLoggedIn = false;

const eventLink = document.getElementById("event-link");
const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

eventLink.addEventListener('click', (event) => {
    if (!isLoggedIn) {
        event.preventDefault();
        window.location.href = "/client/sign-up/index.html";
    }
});

forumLink.addEventListener('click', (event) => {
    if (!isLoggedIn) {
        event.preventDefault();
        window.location.href = "/client/sign-up/index.html";
    }
})

logoutLink.addEventListener('click', (event) => {
    if (isLoggedIn) {
        event.preventDefault();
        isLoggedIn = false;
        window.location.href = "/client/landing/index.html";
    }
})