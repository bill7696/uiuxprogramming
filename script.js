const button = document.getElementById('check');
const status = document.getElementById('status');

button.addEventListener('click', () => {
  status.textContent = '동작 확인됨';
});
