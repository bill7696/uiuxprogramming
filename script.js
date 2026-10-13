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

// 알림 등록 흐름: 알림 시작하기 버튼에서 들어와 종목 → 조건 → 확인 → 완료 순서로 진행합니다.
const alertFlow = document.querySelector('#alertFlow');
const alertSteps = document.querySelectorAll('.alert-step');
const alertProgress = document.querySelector('#alertProgress');
const alertTicker = document.querySelector('#alertTicker');
const alertTickerError = document.querySelector('#alertTickerError');
const alertCondition = document.querySelector('#alertCondition');
const targetPriceField = document.querySelector('#targetPriceField');
const targetPrice = document.querySelector('#targetPrice');
const targetPriceError = document.querySelector('#targetPriceError');
const alertSummary = document.querySelector('#alertSummary');
const alertResult = document.querySelector('#alertResult');
const alertConfirm = document.querySelector('#alertConfirm');
const alertConfirmText = document.querySelector('#alertConfirmText');

// 단계 번호에 맞는 영역 하나만 보이고 진행 표시를 맞춥니다.
function showStep(step) {
  alertSteps.forEach(function (item) {
    item.hidden = Number(item.dataset.step) !== step;
  });
  alertProgress.textContent = step <= 3 ? step + ' / 3 · 등록 단계' : '등록 완료';
}

// 입력창에 오류 표시를 붙이거나 뗍니다.
function setFieldError(input, errorElement, message) {
  errorElement.textContent = message;
  if (message) {
    input.classList.add('has-error');
    input.focus();
  } else {
    input.classList.remove('has-error');
  }
}

// 입력·선택한 값을 한 문장으로 만듭니다.
function makeAlertSummary() {
  const ticker = alertTicker.value.trim().toUpperCase();
  if (alertCondition.value === 'target') {
    const price = Number(targetPrice.value).toLocaleString('ko-KR');
    return ticker + ' · 목표 가격 ' + price + ' 도달 시 알림';
  }
  return ticker + ' · 하루 한 번 시세 요약 알림';
}

// 진입: 동의 후 켜진 알림 시작하기 버튼을 누르면 흐름이 열립니다.
function handleStartClick() {
  alertFlow.hidden = false;
  showStep(1);
  alertTicker.focus();
}

// 1단계 → 2단계: 종목 코드가 비어 있으면 현재 단계에 머뭅니다.
function handleNext1Click() {
  if (alertTicker.value.trim() === '') {
    setFieldError(alertTicker, alertTickerError, '알림받을 종목 코드를 입력해 주세요.');
    return;
  }
  setFieldError(alertTicker, alertTickerError, '');
  showStep(2);
}

// 조건 선택: 목표 가격 도달일 때만 가격 입력칸을 보입니다.
function handleConditionChange() {
  const needsPrice = alertCondition.value === 'target';
  targetPriceField.hidden = !needsPrice;
  if (!needsPrice) {
    targetPrice.value = '';
    setFieldError(targetPrice, targetPriceError, '');
  }
}

// 2단계 → 3단계: 보이는 가격 입력칸만 검사하고 요약을 만듭니다.
function handleNext2Click() {
  const needsPrice = alertCondition.value === 'target';
  const price = Number(targetPrice.value);
  if (needsPrice && (targetPrice.value.trim() === '' || !(price > 0))) {
    setFieldError(targetPrice, targetPriceError, '목표 가격을 0보다 큰 숫자로 입력해 주세요.');
    return;
  }
  setFieldError(targetPrice, targetPriceError, '');
  alertSummary.textContent = makeAlertSummary();
  showStep(3);
}

// 이전: 값은 그대로 두고 단계만 돌아갑니다.
function handleBack2Click() {
  showStep(1);
}

function handleBack3Click() {
  showStep(2);
}

// 확인 팝업: 취소하면 값을 유지한 채 닫고, 확정하면 완료 단계로 갑니다.
function handleCompleteClick() {
  alertConfirmText.textContent = alertSummary.textContent;
  alertConfirm.showModal();
}

function handleConfirmCancel() {
  alertConfirm.close();
}

function handleConfirmSubmit() {
  alertConfirm.close();
  alertResult.textContent = alertSummary.textContent;
  showStep(4);
}

// 다시 등록하기: 입력·선택·오류·진행 상태를 모두 처음으로 되돌립니다.
function handleRestartClick() {
  alertTicker.value = '';
  alertCondition.value = 'target';
  targetPrice.value = '';
  targetPriceField.hidden = false;
  setFieldError(alertTicker, alertTickerError, '');
  setFieldError(targetPrice, targetPriceError, '');
  alertSummary.textContent = '';
  alertResult.textContent = '';
  showStep(1);
  alertTicker.focus();
}

startButton.addEventListener('click', handleStartClick);
document.querySelector('#alertNext1').addEventListener('click', handleNext1Click);
alertCondition.addEventListener('change', handleConditionChange);
document.querySelector('#alertNext2').addEventListener('click', handleNext2Click);
document.querySelector('#alertBack2').addEventListener('click', handleBack2Click);
document.querySelector('#alertBack3').addEventListener('click', handleBack3Click);
document.querySelector('#alertComplete').addEventListener('click', handleCompleteClick);
document.querySelector('#confirmCancel').addEventListener('click', handleConfirmCancel);
document.querySelector('#confirmSubmit').addEventListener('click', handleConfirmSubmit);
document.querySelector('#alertRestart').addEventListener('click', handleRestartClick);
