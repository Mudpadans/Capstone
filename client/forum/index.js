

const eventLink = document.getElementById("event-link");
const logoutLink = document.getElementById("logout-link")
const createModal = document.getElementById("createModal")
const commentModal = document.getElementById("commentModal")
const discussionForm = document.getElementById("discussion-form");
const commentForm = document.getElementById("comment-form")
const createModalBtn = document.getElementById("create-modal-btn")
const span = document.getElementsByClassName("close")[0];
const commentClose = document.getElementById('comment-close');

let currentDiscussionId; 

let replyButtons = []

function getDiscussions() {
let memberId = localStorage.getItem('memberId')

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
    discussionsDiv.innerHTML = '';
    data.forEach(discussions => {
      let discussionDiv = document.createElement('div')
      discussionDiv.classList.add('discussion')
      let buttonDiv = document.createElement('div')
      buttonDiv.classList.add('button-div')

      let h2 = document.createElement('h2');
      let ul = document.createElement('ul');

      let reply = document.createElement('button')
      reply.classList.add('button')
      reply.addEventListener('click', function(event) {
        commentModal.style.display = "block";
        currentDiscussionId = discussions.discussion_id;
        getComments(currentDiscussionId)
      })
      
      h2.textContent = `Discussion: ${discussions.discussion_name}`;
      
      let discussionProperties = [
        `${discussions.discussion_text}`,
        `Discussion Posted: ${discussions.date_posted}`,
        `Posted By: ${discussions.member.first_name}`,
        `Is Active: ${discussions.is_active}`,
      ];

      discussionProperties.forEach(property => {
        let li = document.createElement('li');
        li.textContent = property;
        ul.appendChild(li);
      })
      
      reply.textContent = "Reply"
      replyButtons.push(reply)

      buttonDiv.appendChild(reply)

      discussionDiv.appendChild(h2);
      discussionDiv.appendChild(ul);
      discussionDiv.appendChild(buttonDiv)
      discussionsDiv.appendChild(discussionDiv);

      if (String(discussions.author_id) === String(memberId)) {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("button")
        deleteButton.textContent = 'Delete'

        let updateButton = document.createElement("button")
        updateButton.classList.add("button")
        updateButton.textContent = 'Update'

        deleteButton.addEventListener('click', function(event) {
          event.stopPropagation()
          deleteDiscussion(discussions.discussion_id);
        })

        updateButton.addEventListener('click', function(event) {
          event.stopPropagation()

          document.getElementById('discussion-name').value = discussions.discussion_name;
          document.getElementById('discussion-text').value = discussions.discussion_text;
          document.getElementById('is-active').value = discussions.is_active;

          discussionForm.removeEventListener('submit', createDiscussionHandler);
          discussionForm.onsubmit = function(event) {
            event.preventDefault()
            updateDiscussion(discussions.discussion_id)
          }
          

          createModal.style.display = "block";
        })
        
  
        buttonDiv.appendChild(deleteButton)
        buttonDiv.appendChild(updateButton)
      }
    })

    commentForm.addEventListener('submit', createCommentHandler)

  })
  .catch((error) => {
    console.error('Error:', error)
  })
}

getDiscussions()

function deleteDiscussion(discussionId) {
  axios.delete(`http://localhost:4200/discussions/${discussionId}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      memberId: localStorage.getItem('memberId')
    })
  })
  .then(res => {
    getDiscussions();
    if (res.status !== 'success') {
      throw new Error(res.message || 'Network response was not ok')
    }
    console.log(res.data)
    let discussionsDiv = document.getElementById('discussion-board');
    discussionsDiv.innerHTML = '';
    
    console.log(discussionId)
  })
  .catch((err) => {
    console.error('Error:', err)
  });
  }

  function updateDiscussion(discussionId) {
    let updatedData = {
      memberId: localStorage.getItem('memberId'),
      discussion_name: document.getElementById('discussion-name').value,
      discussion_text: document.getElementById('discussion-text').value,
      is_active: document.getElementById('is-active').checked
    }
  
    updatedData.memberId = localStorage.getItem('memberId')
  
    axios.put(`http://localhost:4200/discussions/${discussionId}`, updatedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const data = response.data
      console.log(data)
      let discussionsDiv = document.getElementById('discussion-board');
      discussionsDiv.innerHTML = '';
      getDiscussions();
      createModal.style.display = "none"
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }

document.getElementById('comment-input').addEventListener('click', function(event) {
  event.stopPropagation();
});

createModalBtn.onclick = function() {
  createModal.style.display = "block";
}

span.onclick = function() {
  discussionForm.removeEventListener('submit', updateDiscussionHandler)
  discussionForm.addEventListener('submit', createDiscussionHandler)
  createModal.style.display = "none";
}

commentClose.onclick = function() {
  commentModal.style.display = "none";
}

window.onclick = function(event) {
  if (!createModal.contains(event.target) && event.target != createModalBtn) {
    createModal.style.display = "none";
  }
  
  let isReplyButtonClicked = replyButtons.some(button => button === event.target);

  if (!commentModal.contains(event.target) && !isReplyButtonClicked) {
    commentModal.style.display = "none";
  }
}

function createDiscussion (dName, dText, isActive) {
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
    getDiscussions();
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}

function createDiscussionHandler(event) {
  event.preventDefault();

  let dName = document.getElementById('discussion-name').value;
  let dText = document.getElementById('discussion-text').value;
  let isActive = document.getElementById('is-active').checked;
  

  createDiscussion(dName, dText, isActive);
}

function updateDiscussionHandler(event) {
  event.preventDefault();

  let discussionId = this.dataset.eventId;
  updateDiscussion(discussionId)
}

discussionForm.addEventListener('submit', createDiscussionHandler)

function getComments(discussionId) {
  let commentList = document.getElementById('comment-section')
  commentList.innerHTML = '';
  let memberId = localStorage.getItem('memberId')

  axios.get(`http://localhost:4200/api/discussions/${discussionId}/comments`, {
    headers: {
    'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(response.data)
    let comments = response.data;
    comments.forEach(comment => {
      let p = document.createElement('p');
      p.textContent = `${comment.first_name}: ${comment.comment}`

      if (parseInt(comment.author_id) === parseInt(memberId)) {
        p.style.cursor = "pointer";
        p.title = "Click to delete";
        p.addEventListener('click', () => deleteComment(comment, discussionId));
      }

      commentList.appendChild(p);
    })
  })
  .catch((err) => {
    console.error('Error:', err)
  })
}

function createComment(discussion_id, author_id, comment) {
  axios.post(`http://localhost:4200/discussions/${discussion_id}/comments`, {
    author_id: author_id,
    discussionId: discussion_id,
    commentText: comment,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'x-member-id': localStorage.getItem('memberId')
    }
  })
  .then(response => {
    console.log(response.data)
  })
  .catch((err) => {
    console.error('Error:', err)
  })
}

function createCommentHandler(event) {
  event.preventDefault();

  let commentText = document.getElementById('comment-input').value;
  let discussion_id = currentDiscussionId;
  let author_id = localStorage.getItem('memberId');

  createComment(discussion_id, author_id, commentText)

  document.getElementById('comment-input').value =  ''
}

function deleteComment(comment, discussionId) {
  console.log(`Deleting comment: ${comment.comment_id}, from discussion: ${discussionId}`);
  axios.delete(`http://localhost:4200/discussions/${discussionId}/comments/${comment.comment_id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-member-id': localStorage.getItem('memberId')
    }
  })
  .then(res => {
    getComments(discussionId);
    console.log(res.data)
  })
  .catch((err) => {
    console.error('Error:', err)
  });
}

window.addEventListener('load', (event) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
      eventLink.href = "/client/event/index.html";
  } else {
      eventLink.href = "/client/sign-up/index.html";
  }
})

logoutLink.addEventListener('click', (event) => {
  event.preventDefault();
  if (localStorage.getItem('isLoggedIn') === 'true') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('memberId')
      window.location.href = "/client/landing/index.html";
      }
  })