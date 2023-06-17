const eventLink = document.getElementById("event-link");
const logoutLink = document.getElementById("logout-link")
const modal = document.getElementById("myModal");
const form = document.getElementById("discussion-form");
const createModalBtn = document.getElementById("create-modal-btn")
const span = document.getElementsByClassName("close")[0];

let isLoggedIn = false;

function getDiscussions() {
  fetch('http://localhost:4200/api/getDiscussions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let discussionsDiv = document.getElementById('discussion-board');
    data.forEach(discussions => {
      let discussionDiv = document.createElement('div')
      discussionDiv.classList.add('discussion')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');
      let reply = document.createElement('button')
      reply.classList.add('button')
      
      h2.textContent = `Discussion: ${discussions.discussion_name}`;
      
      let discussionProperties = [
        `${discussions.discussion_text}`,
        `Discussion Posted: ${discussions.date_posted}`,
        `Posted By: ${discussions.author_id}`,
        `Is Active: ${discussions.is_active}`,
      ];

      discussionProperties.forEach(property => {
        let li = document.createElement('li');
        li.textContent = property;
        ul.appendChild(li);
      })
      
      reply.textContent = "Reply"

      discussionDiv.appendChild(h2);
      discussionDiv.appendChild(ul);
      discussionDiv.appendChild(reply);
      discussionsDiv.appendChild(discussionDiv);
    })
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getDiscussions()

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

function createsDiscussion (dName, dText, isActive) {
  let discussionData = {
    dName: dName,
    dText: dText,
    isActive: isActive
  }

  fetch('http://localhost:4200/discussions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-member-id': localStorage.getItem('memberId')
    },
    body: JSON.stringify(discussionData)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    res.json();
  })
  .then(data => {
    console.log(data);
    let discussionsDiv = document.getElementById('discussion-board');
    data.forEach(discussions => {
      let discussionDiv = document.createElement('div')
      discussionDiv.classList.add('discussion')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');
      let reply = document.createElement('button')
      reply.classList.add('button')
      
      h2.textContent = `Discussion: ${discussions.discussion_name}`;
      
      let discussionProperties = [
        `${discussions.discussion_text}`,
        `Discussion Posted: ${discussions.date_posted}`,
        `Posted By: ${discussions.author_id}`,
        `Is Active: ${discussions.is_active}`,
      ];

      discussionProperties.forEach(property => {
        let li = document.createElement('li');
        li.textContent = property;
        ul.appendChild(li);
      })
      
      reply.textContent = "Reply"

      discussionDiv.appendChild(h2);
      discussionDiv.appendChild(ul);
      discussionDiv.appendChild(reply);
      discussionsDiv.appendChild(discussionDiv);
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  let dName = document.getElementById('discussion-name').value;
  let dText = document.getElementById('discussion-text').value;
  let isActive = document.getElementById('is-active').checked;
  

  createEvent (dName, dText, isActive);
})

window.addEventListener('load', (event) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
      eventLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/event/index.html";
  } else {
      eventLink.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
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