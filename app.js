const routineForm = document.getElementById('routine-form');
const routineList = document.getElementById('routine-list');
const routines = [];

// Service Workerの登録
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    console.log('Service Worker registered');
  });
}

// 通知許可リクエスト
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('通知が許可されました');
  } else {
    console.error('通知が拒否されました');
  }
});

// フォーム送信時の処理
routineForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const time = document.getElementById('routine-time').value;
  const task = document.getElementById('routine-task').value;

  const routine = { time, task };
  routines.push(routine);
  saveRoutines();

  displayRoutines();
  scheduleNotification(time, task);
});

function saveRoutines() {
  localStorage.setItem('routines', JSON.stringify(routines));
}

function loadRoutines() {
  const savedRoutines = JSON.parse(localStorage.getItem('routines') || '[]');
  savedRoutines.forEach(routine => {
    routines.push(routine);
    scheduleNotification(routine.time, routine.task);
  });
  displayRoutines();
}

function displayRoutines() {
  routineList.innerHTML = '';
  routines.forEach(routine => {
    const li = document.createElement('li');
    li.textContent = `${routine.time} - ${routine.task}`;
    routineList.appendChild(li);
  });
}

function scheduleNotification(time, task) {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);

  const delay = targetTime.getTime() - now.getTime();
  if (delay > 0) {
    setTimeout(() => {
      new Notification('ルーティン通知', {
        body: task,
        icon: 'icon.png',
      });
    }, delay);
  }
}

// ページ読み込み時にルーティンを復元
loadRoutines();