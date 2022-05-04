const $title = document.querySelector('.title');
const $content = document.querySelector('.conten');
const $date = document.querySelector('.date');
const $submit = document.querySelector('.submit');
const $container = document.querySelector('.main');
const $signOut = document.querySelector('.signOut');
const $allInputs = document.querySelectorAll('.form input, .form textarea');
console.log($allInputs);

const base = 'https://todo-itacademy.herokuapp.com/api'
const accessToken = localStorage.getItem('accessToken')

function requestsHeader(accessToken) {
  return {
    'Content-type':'application/json',
    'Authorization':`Bearer ${accessToken}`
  }
}

const requests = {
  get:(url,accessToken) => {
    return fetch(url, {
      method:'GET',
      headers:requestsHeader(accessToken)
    })
    .then(res => {
      if (res.status === 401){
        getRefresh()
      }

      return res.json()
    })
  },
  post:(url, accessToken, body) => {
    return  fetch(url, {
      method:'POST',
      headers:requestsHeader(accessToken),
      body:JSON.stringify(body) 
    })
    .then(res => res.json())
  },
  delete:(url, accessToken) => {
    return fetch(url, {
      method:'DELETE',
      headers:requestsHeader(accessToken)
    })
    .then(res => res,json())
  }
}

// <------------------------------------- Check unAuthorized ------------------------------------------->

window.addEventListener('DOMContentLoaded', () => {
  !localStorage.getItem('accessToken')&& window.open('../auth.html', '_self')
})

// <------------------------------------- Render todos when window loaded ------------------------------------------->

window.addEventListener('DOMContentLoaded', () => {
  getTodos()
})

// <------------------------------------- Get Todos ------------------------------------------->

function getTodos() {
  requests.get(`${base}/todos`,accessToken)
  .then(r => {
    const todos = r.todos
    const result = todos
      .reverse()
      .map(todo => cardTemplate(todo))
      .join('')

      $container.innerHTML = result
  })
}


// <-------------------------------------- get single Todo ------------------------------------->

const getSingleTodo = id => requests.get(`${base}/todos/${id}`, accessToken)


// <------------------------------------- Create Todos ---------------------------------------->

function createTodos() {

  $submit.disabled = true

  requests.post(`${base}/todos/create`, accessToken, getValueFromInputs())
  .then(getTodos)
  .finally(() => $submit.disabled = false)
}

// <------------------------------------- Card Template ---------------------------------------->

function cardTemplate({title, content, date, id, completed, edited}){
  return `
    <div class="card">
      <div class="card-header" style="border-bottom: 1px solid white">
        <h1>${title}</h1>
        ${completed ? `<img src="https://cdn4.iconfinder.com/data/icons/colicon/24/checkmark_done_complete-512.png" style="width:30px;height:30px; margin-top: 10px; margin-left: 10px" />` : ''}
      </div>
      <div class="card-desc">
        <h1 style="color: white; text-align: center; font-size: 20px; padding:5px">${
        content.length > 80 ? `${content.split('').slice(0, 81).join('')}...` 
        : content}</h1>
        <p class="time" style="color:gold; text-align: center; font-size: 15px; padding:5px;">
          ${date}
          ${edited.state ? `<span class="small">edited. ${edited.date}</span>` : ''}
        </p>
      </div>
      <div class="card-footer" style="border-top: 1px solid white; padding-top: 2rem">
        <button class="delete" onclick="deleteTodo('${id}')">Delete</button>
        <button class="done" onclick="completeTodo('${id}')">✓</button>
        <button class="edit" onclick="editTodo('${id}')">Edit</button>
      </div>
    </div>
  `
}

// <------------------------------------- Complete Todo --------------------------------------->

function completeTodo(id) {
  requests.get(`${base}/todos/${id}/completed`, accessToken)
  .then(getTodos)
}


// <------------------------------------- Delete Todo ---------------------------------------->

function deleteTodo(id) {
  requests.delete(`${base}/todos/${id}`, accessToken)
  .then(getTodos)
}


// <------------------------------------- Edit Todo ------------------------------------------>

function editTodo(id) {
  getSingleTodo(id)
  .then(res => {
    fetch(`${base}/todos/${id}`, {
      method:'PUT',
      headers:requestsHeader(accessToken),
      body:JSON.stringify({
        title:prompt('New title', res.title) || res.title,
        content:prompt('New content', res.content) || res.content
      })
    })
    .then(getTodos)
  })
}



function isValidate() {
  $allInputs.forEach(item => {
    item.value.length === 0
    ? item.classList.add('border-danger')
    : item.classList.remove('border-danger')
  })
  return [...$allInputs].every(item => item.value)
}

function getValueFromInputs() {
  return [...$allInputs].reduce((object, input) => {
    return {
      ...object,
      [input.name]:input.value
    }
  })
}

$submit.addEventListener('click', e => {
  e.preventDefault()
  $submit.disabled = true
  
  isValidate && createTodos()
})


// <------------------------------------ Sign Out -------------------------------------------->

$signOut.addEventListener('click', e => {
  e.preventDefault()
  
  const refreshToken = localStorage.getItem('refreshToken')
  
  $signOut.disabled = true
  $signOut.classList.add('disabled')
  
  requests.post(`${base}/logout`,'', {refreshToken})
  .then(res => {
    console.log(res);
    localStorage.clear()
    window.open('../auth.html', '_self')
  })
  .finally(() => {
    $signOut.disabled = false
    $signOut.classList.remove('disabled')
  })
})

// <------------------------------------ Get Refresh ------------------------------------------>

function getRefresh(){
  requests.post(`${base}/refresh`,accessToken,{refreshToken})
  then(getTodos)
}