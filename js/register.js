const $allInputs = document.querySelectorAll('.form input');
const $btn = document.querySelector('.btn');
const base_url = 'https://todo-itacademy.herokuapp.com/api'

function getRegister(url) {
  fetch(`${url}/registration`, {
    method:'POST',  
    body:JSON.stringify(getValueFromInputs()),
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
  .finally($btn.disabled = false)
}

$btn.addEventListener('click', e => {
  e.preventDefault()
  $btn.disabled = true
  isValidate() && getRegister(base_url)
})

window.addEventListener('DOMContentLoaded', () => {
  localStorage.getItem('accessToken') && window.open('../auth.html', '_self')
})

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