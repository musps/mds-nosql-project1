const socket = io();
const elUsername = document.querySelector('#username');
const elMessage = document.querySelector('#message');
const elBtnClearContent = document.querySelector('#btnClearContent');

const getUsername = () => {
  return elUsername.value.trim();
};

const clearContent = () => {
  document.querySelector('.main').innerHTML = '';
}

const addMessage = ({username, message}) => {
  const tpl = document.querySelector('#template_mMessage')
    .content.firstElementChild.cloneNode(true);

  tpl.querySelector('label').innerHTML = username;
  tpl.querySelector('p').innerHTML = message;

  document.querySelector('.main').prepend(tpl);
};

const sendMessage = event => {
  const {keyCode, target: {value}} = event;

  if (keyCode === 13) {
    setTimeout(() => {
      event.target.value = '';
    }, 100);
    setTimeout(() => {
      if (value !== '') {
        socket.emit('new_message', {
          'username': getUsername(),
          'message': value
        });
      }
    }, 103);
  }
};

socket.on('add_message', addMessage);
elMessage.addEventListener('keypress', sendMessage);
elBtnClearContent.addEventListener('click', clearContent);

