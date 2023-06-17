const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")
const modal = document.getElementById("myModal");
const form = document.getElementById("event-form");
const createModalBtn = document.getElementById("create-modal-btn")
const span = document.getElementsByClassName("close")[0];

function getEvents() {
  fetch('http://localhost:XXXX/api/getEvents', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let eventsDiv = document.getElementById('event-calendar');
    data.forEach(events => {
      let eventDiv = document.createElement('div')
      eventDiv.classList.add('event')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');
      let goingButton = document.createElement('button')
      goingButton.classList.add('button')
      let notGoingButton = document.createElement('button')
      notGoingButton.classList.add('button')
      
      h2.textContent = `Event: ${events.event_name}`;
      
      let eventProperties = [
        `Date: ${events.event_date}`,
        `Location: ${events.location}`,
        `Event Posted: ${events.event_creation_date}`,
        `Hosted By: ${events.host_id}`,
        `Number of Guests: ${events.member_guests}`,
        `Capacity: ${events.maximum_capacity}`,
        `Is Active: ${events.is_active}`,
        `Event Description ${events.event_text}`
      ];

      eventProperties.forEach(property => {
        let li = document.createElement('li');
        li.textContent = property;
        ul.appendChild(li);
      })
      
      goingButton.textContent = "Going?"
      notGoingButton.textContent = "Not Going?"

      eventDiv.appendChild(h2);
      eventDiv.appendChild(ul);
      buttonDiv.appendChild(goingButton);
      buttonDiv.appendChild(notGoingButton);
      eventDiv.appendChild(buttonDiv);
      eventsDiv.appendChild(eventDiv);
    })
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getEvents()

createModalBtn.onclick = function() {
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

function createEvent (eName, eDate, location, capacity, isActive, eText) {
  let eventData = {
    eName: eName,
    eDate: eDate,
    location: location,
    capacity: capacity,
    isActive: isActive,
    eText: eText
  }

  fetch('http://localhost:4200/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-member-id': localStorage.getItem('memberId')
    },
    body: JSON.stringify(eventData)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    res.json();
  })
  .then(data => {
    console.log(data);
    let eventsDiv = document.getElementById('event-calendar');
    data.forEach(events => {
      let eventDiv = document.createElement('div')
      eventDiv.classList.add('event')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');
      let goingButton = document.createElement('button')
      goingButton.classList.add('button')
      let notGoingButton = document.createElement('button')
      notGoingButton.classList.add('button')
      
      h2.textContent = `Event: ${events.event_name}`;
      
      let eventProperties = [
        `Date: ${events.event_date}`,
        `Location: ${events.location}`,
        `Event Posted: ${events.event_creation_date}`,
        `Hosted By: ${events.host_id}`,
        `Number of Guests: ${events.member_guests}`,
        `Capacity: ${events.maximum_capacity}`,
        `Is Active: ${events.is_active}`,
        `Event Description ${events.event_text}`
      ];

      eventProperties.forEach(property => {
        let li = document.createElement('li');
        li.textContent = property;
        ul.appendChild(li);
      })
      
      goingButton.textContent = "Going?"
      notGoingButton.textContent = "Not Going?"

      eventDiv.appendChild(h2);
      eventDiv.appendChild(ul);
      buttonDiv.appendChild(goingButton);
      buttonDiv.appendChild(notGoingButton);
      eventDiv.appendChild(buttonDiv);
      eventsDiv.appendChild(eventDiv);
    })
  .catch((error) => {
    console.error('Error:', error);
  })
})
}
 
form.addEventListener('submit', function(event) {
  event.preventDefault();

  let eName = document.getElementById('event-name').value;
  let eDate = document.getElementById('event-date').value;
  let location = document.getElementById('location').value;
  let capacity = document.getElementById('capacity').value;
  let isActive = document.getElementById('is-active').checked;
  let eText = document.getElementById('event-text').value;

  createEvent (eName, eDate, location, capacity, isActive, eText);
})

window.addEventListener('load', (event) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
      forumLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/forum/index.html";
  } else {
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

