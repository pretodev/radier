
let consoleWrapper;


function createPrintElement(data) {
  const spanEl = document.createElement('span')
  spanEl.textContent = `${data}`

  const consoleLineEl = document.createElement('div')
  consoleLineEl.classList.add('console-line')
  consoleLineEl.appendChild(spanEl)
  return consoleLineEl
}

function createInputElement(label, callbackFn) {
  const spanEl = document.createElement('span')
  spanEl.textContent = `${label}`

  const inputEl = document.createElement('input')
  inputEl.type = 'text'
  inputEl.placeholder = 'digite aqui...'

  inputEl.addEventListener('change', (event) => {
    const content = event.target.value
    if (content.length) {
      callbackFn(content)
      inputEl.disabled = true
    }
  })

  const consoleLineEl = document.createElement('div')
  consoleLineEl.classList.add('console-line')
  consoleLineEl.appendChild(spanEl)
  consoleLineEl.appendChild(inputEl)
  return {
    element: consoleLineEl,
    focus: () => inputEl.focus(),
  }
}

export function attach(elementId) {
  consoleWrapper = document.getElementById(elementId)
}

export function print(data) {
  const consoleLineElement = createPrintElement(data)
  consoleWrapper.appendChild(consoleLineElement)
}

export function input(label) {
  return new Promise(resolve => {
    const component = createInputElement(label, (value) => {
      resolve(value);
    })
    consoleWrapper.appendChild(component.element)
    component.focus()
  })
}

export function clear() {
  if (consoleWrapper && consoleWrapper.innerHTML) {
    consoleWrapper.innerHTML = ''
  }
}

