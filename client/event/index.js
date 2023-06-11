const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")

let isLoggedIn = false;

function getEvents() {
  fetch('http://localhost:4200/api/events', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let eventsDiv = document.getElementById('events');
    data.forEach(event => {
      let h2 = document.createElement('h2');
      let p = document.getElementById('p');
      h2.textContent = `Event: ${event.event_name}`
      p.textContent = `Date: ${event.event_date}, Location: ${event.location}, Event Posted: ${event.event_creation_date}, Hosted By: ${event.host_id}, Number of Guests: ${event.member_guests}, Capacity: ${event.maximum_capacity}, Status: ${event.status}`;
      eventsDiv.appendChild(h2, p);
    })
  })
}


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

window.onload = function() {
    axios.get('http://localhost:4200/checkAuthentication')
      .then(res => {
        if(res.data.status !== "Authenticated") {
          window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
        }
      })
      .catch(err => {
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
      });
  };