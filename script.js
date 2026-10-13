// 개발자 도구의 Console에서 연결을 확인합니다.
console.log('JavaScript가 연결되었습니다.');

// 알림 신청 폼의 네 요소를 id로 찾습니다.
const subscribeForm = document.querySelector('#subscribe-form');
const emailInput = document.querySelector('#email');
const subscribeButton = document.querySelector('#subscribeButton');
const subscribeMessage = document.querySelector('#subscribeMessage');

// 이메일 모양인지 확인하는 규칙입니다. (아이디@도메인.확장자)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 버튼의 처음 문구를 기억해 두고, 신청이 끝났는지를 상태로 가집니다.
const defaultButtonText = subscribeButton.textContent;
let isSubscribed = false;

// 안내 문구와 입력창의 모양을 결과에 맞게 바꿉니다.
function showMessage(text, type) {
  subscribeMessage.textContent = text;
  subscribeMessage.classList.remove('is-error', 'is-success');
  emailInput.classList.remove('is-invalid');

  if (type === 'error') {
    subscribeMessage.classList.add('is-error');
    emailInput.classList.add('is-invalid');
  } else if (type === 'success') {
    subscribeMessage.classList.add('is-success');
  }
}

// 입력값을 확인하고 결과에 맞는 안내와 버튼 상태를 보여줍니다.
function handleSubscribe(event) {
  event.preventDefault();

  const email = emailInput.value.trim();

  if (email === '') {
    showMessage('이메일을 입력해 주세요.', 'error');
    emailInput.focus();
    return;
  }

  if (!emailPattern.test(email)) {
    showMessage('이메일 형식이 올바르지 않습니다. name@example.com 처럼 입력해 주세요.', 'error');
    emailInput.focus();
    return;
  }

  isSubscribed = true;
  showMessage(`${email} 으로 시세 알림을 보내드립니다.`, 'success');
  subscribeButton.textContent = '신청 완료';
  subscribeButton.classList.add('is-done');
  subscribeButton.disabled = true;
}

// 이메일을 다시 고치면 상태에 따라 화면을 되돌립니다.
function handleInput() {
  if (isSubscribed) {
    isSubscribed = false;
    subscribeButton.textContent = defaultButtonText;
    subscribeButton.classList.remove('is-done');
    subscribeButton.disabled = false;
    showMessage('', '');
    return;
  }

  if (subscribeMessage.classList.contains('is-error')) {
    showMessage('', '');
  }
}

subscribeForm.addEventListener('submit', handleSubscribe);
emailInput.addEventListener('input', handleInput);

// 알림 설정 영역의 여섯 요소를 id로 찾습니다.
const themeButton = document.querySelector('#themeButton');
const tickerInput = document.querySelector('#ticker');
const tickerCount = document.querySelector('#tickerCount');
const agreeCheck = document.querySelector('#agreeCheck');
const agreeMessage = document.querySelector('#agreeMessage');
const startButton = document.querySelector('#startButton');

// click: body의 dark 클래스를 켜고 끄며 버튼 문구를 맞춥니다.
function handleThemeClick() {
  const isDark = document.body.classList.toggle('dark');
  themeButton.textContent = isDark ? '라이트 테마로 바꾸기' : '다크 테마로 바꾸기';
  themeButton.setAttribute('aria-pressed', String(isDark));
}

// input: 글자를 넣거나 지울 때마다 현재 글자 수를 보여줍니다.
function handleTickerInput() {
  const currentLength = tickerInput.value.length;
  tickerCount.textContent = currentLength + ' / 10';
}

// change: 동의 여부에 따라 문구·클래스·버튼 상태를 함께 바꿉니다.
function handleAgreeChange() {
  const agreed = agreeCheck.checked;
  startButton.disabled = !agreed;
  agreeMessage.textContent = agreed ? '알림 수신에 동의했습니다.' : '알림 수신 동의 전입니다.';

  if (agreed) {
    agreeMessage.classList.add('is-ready');
  } else {
    agreeMessage.classList.remove('is-ready');
  }
}

themeButton.addEventListener('click', handleThemeClick);
tickerInput.addEventListener('input', handleTickerInput);
agreeCheck.addEventListener('change', handleAgreeChange);

// 기능 탭: 버튼과 패널을 모두 찾아 같은 click 함수를 연결합니다.
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

// 모든 탭과 패널을 선택되지 않은 상태로 되돌립니다.
function resetTabsAndPanels() {
  tabs.forEach(function (tab) {
    tab.classList.remove('is-active');
    tab.setAttribute('aria-selected', 'false');
  });
  panels.forEach(function (panel) {
    panel.classList.remove('is-active');
    panel.hidden = true;
  });
}

// 누른 탭과 data-target이 가리키는 패널만 선택 상태로 만듭니다.
function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const targetPanel = document.querySelector(targetSelector);
  clickedTab.classList.add('is-active');
  clickedTab.setAttribute('aria-selected', 'true');
  targetPanel.classList.add('is-active');
  targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', handleTabClick);
});
