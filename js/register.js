const $email = document.querySelector('.emailInput');
const $password = document.querySelector('.passwordInput');
const $btn = document.querySelector('.btn');
const base_url = 'https://todo-itacademy.herokuapp.com/api'

function getRegister(url) {
  fetch(`${url}/registration`, {
    method:'POST',  
    body:JSON.stringify({
      email:$email.value,
      password: $password.value,
    }),
    headers: {
      'Content-type':'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    localStorage.setItem('userId', res.user.id)
    localStorage.setItem('isActivated', res.user.isActivated)
    window.open('../auth.html', '_self')
  })
  .finally(() => {
    $btn.disabled = false
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()

  $btn.disabled = true
  getRegister(base_url)
})

window.addEventListener('DOMContentLoaded', () => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    window.open('../auth.html', '_self')
  }
})