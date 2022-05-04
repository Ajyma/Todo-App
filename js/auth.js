const $btn = document.querySelector('.btn');
const $allInputs = document.querySelectorAll('.form input');
const base_url = 'https://todo-itacademy.herokuapp.com/api/'

function getAuth(url) {
  fetch(`${url}/login`, {
    method:'POST',
    body:JSON.stringify(getValueFromInputs()),
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
  isValidate() && getAuth(base_url)
  $btn.disabled = true
})

window.addEventListener('DOMContentLoaded', () => {
  localStorage.getItem('isActivated')&& window.open('../index.html', '_self')
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