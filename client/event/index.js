const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")
const modal = document.getElementById("myModal");
const eventBtn = document.getElementById("event-btn");
const modalBtn = document.getElementById("modal-btn")
const span = document.getElementsByClassName("close")[0];

let isLoggedIn = false;

function getEvents() {
  fetch('http://localhost:4200/api/getEvents', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let eventsDiv = document.getElementById('events');
    data.forEach(events => {
      let h2 = document.createElement('h2');
      let p = document.createElement('p');
      h2.textContent = `Event: ${events.event_name}`
      p.textContent = `Date: ${events.event_date}, Location: ${events.location}, Event Posted: ${events.event_creation_date}, Hosted By: ${events.host_id}, Number of Guests: ${events.member_guests}, Capacity: ${events.maximum_capacity}, Is Active: ${events.is_active}, Event Description ${events.event_text}`;
      eventsDiv.appendChild(h2);
      eventsDiv.appendChild(p);
    })
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getEvents()

modalBtn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

eventBtn.addEventListener('submit', function(event) {
  event.preventDefault();

  let eventData = {
      eName: document.getElementById('event-name').value,
      eDate: document.getElementById('event-date').value,
      location: document.getElementById('location').value,
      capacity: document.getElementById('capacity').value,
      isActive: document.getElementById('is-active').checked,
      eText: document.getElementById('event-text').value
  }

  axios.post("http://localhost:4200/events", eventData).then(res => {
      console.log(res.data);
  }).catch(err => console.log(err))
})

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