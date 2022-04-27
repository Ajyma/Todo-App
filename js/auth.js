const $email = document.querySelector('.emailInput');
const $password = document.querySelector('.passwordInput');
const $btn = document.querySelector('.btn');
const base_url = 'https://todo-itacademy.herokuapp.com/api/'

function getAuth(url) {
  fetch(`${url}/login`, {
    method:'POST',
    body:JSON.stringify({
      email:$email.value,
      password:$password.value
    }),
    headers:{
      'Content-type':'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('userId', res.user.id)
    if (res.user.isActivated) {
      window.open('../index.html', '_self')
      localStorage.setItem('isActivated', res.user.isActivated)
    }
  })
  .finally(() => {
    $btn.disabled = false
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()

  $btn.disabled = true
  getAuth(base_url)
})

window.addEventListener('DOMContentLoaded', () => {
  const isActicated = localStorage.getItem('isActivated')

  if (isActicated === 'true') {
    window.open('../index.html', '_self')
  }
})