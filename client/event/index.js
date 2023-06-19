const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")
const modal = document.getElementById("myModal");
const form = document.getElementById("event-form");
const createModalBtn = document.getElementById("create-modal-btn")
const span = document.getElementsByClassName("close")[0];

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
      goingButton.addEventListener('click', function() {
        let status = true;
      
        let data = {
          memberId: localStorage.getItem('memberId'), 
          eventId: events.event_id,
          status: status
        };
      
        fetch('http://localhost:4200/updateAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          eventsDiv.innerHTML = '';
          getEvents();
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      })

      let notGoingButton = document.createElement('button')
      notGoingButton.classList.add('button')
      notGoingButton.addEventListener('click', function() {
        let status = false;
      
        let data = {
          memberId: localStorage.getItem('memberId'), 
          eventId: events.event_id,
          status: status
        };
      
        fetch('http://localhost:4200/updateAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          eventsDiv.innerHTML = '';
          getEvents();
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      })
      
      h2.textContent = `Event: ${events.event_name}`;
      
      let eventProperties = [
        `Date: ${events.event_date || 'Unknown'}`,
        `Location: ${events.location || 'Unknown'}`,
        `Event Posted: ${events.event_creation_date}`,
        `Hosted By: ${events.member.first_name}`,
        `Number of Guests: ${events.member_guests}`,
        `Capacity: ${events.maximum_capacity}`,
        `Is Active: ${events.is_active}`,
        `Event Description ${events.event_text || ""}`
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

      eventDiv.addEventListener('click', function() {
        showModal(events)
      })
      console.log(events)
    })
    
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getEvents()

function showModal(events) {
  let eventName = document.getElementById("event-name")
  eventName.value = events.event_name;

  let deleteButton = document.getElementbyId("delete-button");
  let updateButton = document.getElementById("update-button")

  deleteButton.addEventListener('click', function() {
    deleteEvent(events.event_id);
  })

  updateButton.addEventListener('click', function() {
    updateEvent(events.event_id);
  })

  modal.style.display = "block"
}

function deleteEvent(eventId) {
  fetch(`http://localhost:XXXX/deleteEvent/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      memberId: localStorage.getItem('memberId')
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    let eventsDiv = document.getElementById('event-calendar');
    eventsDiv.innerHTML = '';
    getEvents();
  })
  .catch((err) => {
    console.error('Error:', error)
  })
}

function updateEvent(eventId) {
  let updatedData = {
    event_name: document.getElementById('event-name').value || 'Unknown',
    event_date: document.getElementById('event-date').value || 'Unknown',
    location: document.getElementById('location').value,
    capacity: document.getElementById('capacity').value,
    is_active: document.getElementById('is-active').value,
    event_text: document.getElementById('event-text').value || ""
  }

  updatedData.memberId = localStorage.getItem('memberId')

  fetch(`http://localhost:XXXX/updateEvent/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedData)
  })
  .then(response => {
    if (!response.ok) {
      if (response.status === 403) {
        alert('You are not authorize to update this event.') 
        throw new Error('403 Forbidden');
      } else {
        throw new Error('Network response was not ok')
      }
    }
    response.json();
  })
  .then(data => {
    console.log(data)
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    let eventsDiv = document.getElementById('event-calendar');
    eventsDiv.innerHTML = '';
    getEvents();
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

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
      goingButton.addEventListener('click', function() {
        let status = true;
      
        let data = {
          memberId: localStorage.getItem('memberId'), 
          eventId: events.event_id,
          status: status
        };
      
        fetch('http://localhost:4200/updateAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          eventsDiv.innerHTML = '';
          getEvents();
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      })

      let notGoingButton = document.createElement('button')
      notGoingButton.classList.add('button')
      notGoingButton.addEventListener('click', function() {
        let status = false;
      
        let data = {
          memberId: localStorage.getItem('memberId'), 
          eventId: events.event_id,
          status: status
        };
      
        fetch('http://localhost:4200/updateAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          eventsDiv.innerHTML = '';
          getEvents();
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      })
      
      h2.textContent = `Event: ${events.event_name}`;
      
      let eventProperties = [
        `Date: ${events.event_date}`,
        `Location: ${events.location}`,
        `Event Posted: ${events.event_creation_date}`,
        `Hosted By: ${events.members ? events.members.first_name : 'Unknown'}`,
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

