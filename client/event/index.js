const forumLink = document.getElementById("forum-link");
const logoutLink = document.getElementById("logout-link")
const createModal = document.getElementById("createModal");
// const updateModal = document.getElementById("updateModal")
const form = document.getElementById("event-form");
const createModalBtn = document.getElementById("create-modal-btn")
const span = document.getElementsByClassName("close")[0];

function getEvents() {
  let memberId = localStorage.getItem('memberId')

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
    eventsDiv.innerHTML ='';
    data.forEach(events => {
      let eventDiv = document.createElement('div')
      eventDiv.classList.add('event')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');

      let goingButton = document.createElement('button')
      goingButton.classList.add('button')
      goingButton.addEventListener('click', function(event) {
        event.stopPropagation();

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
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      })

      let notGoingButton = document.createElement('button')
      notGoingButton.classList.add('button')
      notGoingButton.addEventListener('click', function(event) {
        event.stopPropagation();

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

      console.log(`events.host_id: ${events.host_id}, memberId: ${memberId}`)

      if (String(events.host_id) === String(memberId)) {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("button")
        deleteButton.textContent = 'Delete'

        let updateButton = document.createElement("button")
        updateButton.classList.add("button")
        updateButton.textContent = 'Update'

        deleteButton.addEventListener('click', function(event) {
          event.stopPropagation()
          deleteEvent(events.event_id);
        })

        updateButton.addEventListener('click', function(event) {
          event.stopPropagation()
          updateEvent(events.event_id);
        })

        buttonDiv.appendChild(deleteButton)
        buttonDiv.appendChild(updateButton)
      }
    })
    
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getEvents()


function deleteEvent(eventId) {
  const memberId = localStorage.getItem('memberId')
  fetch(`http://localhost:4200/deleteEvent/${eventId}/${memberId}`, {
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
    if (data.status !== 'success') {
      throw new Error(data.message || 'Network response was not ok')
    }
    console.log(data)
    let eventsDiv = document.getElementById('event-calendar');
    eventsDiv.innerHTML = '';
    getEvents();
    console.log(eventId)
  })
  .catch((err) => {
    console.error('Error:', err)
  });
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

  fetch(`http://localhost:4200/updateEvent/${eventId}`, {
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
    updateModal.style.display = "none";
    let eventsDiv = document.getElementById('event-calendar');
    eventsDiv.innerHTML = '';
    getEvents();
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

createModalBtn.onclick = function() {
  createModal.style.display = "block";
}

span.onclick = function() {
  createModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == createModal) {
    createModal.style.display = "none";
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

  let memberId = localStorage.getItem('memberId')

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
    return res.json();
  })
  .then(data => {
    console.log(data);
    getEvents();
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
        `Event Description: ${events.event_text}`
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

    if (events.host_id === memberId) {
      let deleteButton = document.createElement("button");
      deleteButton.classList.add("button")
      deleteButton.textContent = 'delete'

      let updateButton = document.createElement("button")
      updateButton.classList.add("button")
      updateButton.textContent = 'update'

      deleteButton.addEventListener('click', function(event) {
        event.stopPropagation()
        deleteEvent(events.event_id);
      })

      updateButton.addEventListener('click', function(event) {
        event.stopPropagation()
        updateEvent(events.event_id);
      })

      buttonDiv.appendChild(deleteButton)
      buttonDiv.appendChild(updateButton)
    }
  })

  .catch((error) => {
    console.error('Error:', error);
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



