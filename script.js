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
const alertDuplicateError = document.querySelector('#alertDuplicateError');

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
  alertDuplicateError.textContent = '';
  showStep(3);
}

// 이전: 값은 그대로 두고 단계만 돌아갑니다.
function handleBack2Click() {
  showStep(1);
}

function handleBack3Click() {
  showStep(2);
}

// 확인 팝업: 같은 알림이 이미 목록에 있으면 열지 않고 3단계에서 고칠 방법을 보여줍니다.
// 취소하면 값을 유지한 채 닫고, 확정하면 목록에 넣고 완료 단계로 갑니다.
function handleCompleteClick() {
  if (isDuplicateAlert()) {
    alertDuplicateError.textContent = '이미 등록된 알림입니다. 이전으로 돌아가 종목이나 조건을 바꿔 주세요.';
    return;
  }
  alertDuplicateError.textContent = '';
  alertConfirmText.textContent = alertSummary.textContent;
  alertConfirm.showModal();
}

function handleConfirmCancel() {
  alertConfirm.close();
}

function handleConfirmSubmit() {
  alertConfirm.close();
  addRegisteredAlert();
  alertResult.textContent = alertSummary.textContent;
  showStep(4);
}

// 다시 등록하기: 등록 흐름의 입력·선택·오류·진행 상태만 처음으로 되돌립니다. 등록한 알림 목록은 그대로 둡니다.
function handleRestartClick() {
  alertTicker.value = '';
  alertCondition.value = 'target';
  targetPrice.value = '';
  targetPriceField.hidden = false;
  setFieldError(alertTicker, alertTickerError, '');
  setFieldError(targetPrice, targetPriceError, '');
  alertDuplicateError.textContent = '';
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

// 등록한 알림 목록: 등록 확정한 알림을 쌓아 보여주고, 항목마다 삭제할 수 있습니다.
const alertListSection = document.querySelector('#alertList');
const alertListItems = document.querySelector('#alertListItems');
const alertListCount = document.querySelector('#alertListCount');
const alertListEmpty = document.querySelector('#alertListEmpty');
const alertListMessage = document.querySelector('#alertListMessage');
const alertListAdd = document.querySelector('#alertListAdd');
const alertShowList = document.querySelector('#alertShowList');
const deleteConfirm = document.querySelector('#deleteConfirm');
const deleteConfirmText = document.querySelector('#deleteConfirmText');
const deleteCancel = document.querySelector('#deleteCancel');
const deleteSubmit = document.querySelector('#deleteSubmit');

// 등록한 알림을 배열로 가집니다. 삭제할 때 찾을 수 있도록 번호를 하나씩 붙입니다.
const registeredAlerts = [];
let nextAlertId = 1;
let pendingDeleteId = null;

// 목록 아래 결과 문구를 결과 종류에 맞는 색으로 보여줍니다.
function showListMessage(text, type) {
  alertListMessage.textContent = text;
  alertListMessage.classList.remove('is-success', 'is-error', 'is-muted');
  if (type) {
    alertListMessage.classList.add('is-' + type);
  }
}

// 지금 3단계에 있는 종목·조건·가격이 목록에 이미 있는지 확인합니다.
function isDuplicateAlert() {
  const ticker = alertTicker.value.trim().toUpperCase();
  const condition = alertCondition.value;
  const price = condition === 'target' ? Number(targetPrice.value) : null;
  return registeredAlerts.some(function (alert) {
    return alert.ticker === ticker && alert.condition === condition && alert.price === price;
  });
}

// 목록 항목 하나를 만듭니다. 문구와 삭제 버튼을 한 줄에 둡니다.
function createAlertItem(alert) {
  const item = document.createElement('li');
  item.className = 'alert-item';
  item.dataset.id = String(alert.id);

  const text = document.createElement('span');
  text.className = 'alert-item-text';
  text.textContent = alert.summary;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'secondary-button alert-item-delete';
  deleteButton.dataset.id = String(alert.id);
  deleteButton.textContent = '삭제';
  deleteButton.setAttribute('aria-label', alert.summary + ' 삭제');
  deleteButton.addEventListener('click', handleDeleteClick);

  item.appendChild(text);
  item.appendChild(deleteButton);
  return item;
}

// 배열 내용대로 목록을 다시 그리고, 개수와 빈 목록 안내를 맞춥니다.
function renderAlertList() {
  alertListItems.textContent = '';
  registeredAlerts.forEach(function (alert) {
    alertListItems.appendChild(createAlertItem(alert));
  });

  const count = registeredAlerts.length;
  alertListCount.textContent = count + '개';
  alertListItems.hidden = count === 0;
  alertListEmpty.hidden = count > 0;
}

// 등록 확정한 알림을 배열에 넣고 목록과 결과 문구를 갱신합니다.
function addRegisteredAlert() {
  const condition = alertCondition.value;
  const newAlert = {
    id: nextAlertId,
    ticker: alertTicker.value.trim().toUpperCase(),
    condition: condition,
    price: condition === 'target' ? Number(targetPrice.value) : null,
    summary: alertSummary.textContent
  };
  nextAlertId += 1;
  registeredAlerts.push(newAlert);
  renderAlertList();
  showListMessage('등록했습니다: ' + newAlert.summary, 'success');
}

// 완료 단계의 등록한 알림 보기: 목록 영역으로 이동합니다.
function handleShowListClick() {
  alertListSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  alertListAdd.focus({ preventScroll: true });
}

// 목록의 알림 등록하기: 동의 전이면 안내하고 동의 체크로 보내고, 동의 후면 등록 흐름을 엽니다.
function handleListAddClick() {
  if (!agreeCheck.checked) {
    showListMessage('알림 수신에 동의한 뒤 등록할 수 있습니다.', 'error');
    agreeCheck.focus();
    return;
  }
  showListMessage('', '');
  handleStartClick();
}

// 삭제 버튼: 어느 항목인지 기억하고 확인 팝업을 엽니다.
function handleDeleteClick(event) {
  pendingDeleteId = Number(event.currentTarget.dataset.id);
  const target = registeredAlerts.find(function (alert) {
    return alert.id === pendingDeleteId;
  });
  deleteConfirmText.textContent = target.summary;
  deleteConfirm.showModal();
}

// 삭제 확정: 배열에서 빼고 목록을 다시 그린 뒤, 남은 항목이나 등록 버튼으로 포커스를 옮깁니다.
function handleDeleteSubmit() {
  const index = registeredAlerts.findIndex(function (alert) {
    return alert.id === pendingDeleteId;
  });
  const removed = registeredAlerts.splice(index, 1)[0];
  pendingDeleteId = null;
  deleteConfirm.close();
  renderAlertList();
  showListMessage('삭제했습니다: ' + removed.summary, 'success');

  const nextButton = alertListItems.querySelector('.alert-item-delete');
  if (nextButton) {
    nextButton.focus();
  } else {
    alertListAdd.focus();
  }
}

// 취소 버튼: 팝업만 닫습니다. 닫힘 처리는 아래 close 이벤트에서 합니다.
function handleDeleteCancel() {
  deleteConfirm.close();
}

// 팝업이 닫혔는데 삭제하지 않았다면(취소 버튼·Esc) 목록을 그대로 두고 취소했다고 알립니다.
function handleDeleteClose() {
  if (pendingDeleteId === null) {
    return;
  }
  const cancelledId = pendingDeleteId;
  pendingDeleteId = null;
  showListMessage('삭제를 취소했습니다.', 'muted');
  const button = alertListItems.querySelector('.alert-item-delete[data-id="' + cancelledId + '"]');
  if (button) {
    button.focus();
  }
}

alertShowList.addEventListener('click', handleShowListClick);
alertListAdd.addEventListener('click', handleListAddClick);
deleteCancel.addEventListener('click', handleDeleteCancel);
deleteSubmit.addEventListener('click', handleDeleteSubmit);
deleteConfirm.addEventListener('close', handleDeleteClose);

renderAlertList();
