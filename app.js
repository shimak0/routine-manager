const routineForm = document.getElementById('routine-form');
const routineList = document.getElementById('routine-list');
let routines = [];

// スケジュールを作成・保存
routineForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const time = document.getElementById('routine-time').value;
  const task = document.getElementById('routine-task').value;

  const routine = { id: Date.now(), time, task }; // IDを一意にする
  routines.push(routine);
  saveRoutines();
  displayRoutines();
});

// スケジュールの保存
function saveRoutines() {
  localStorage.setItem('routines', JSON.stringify(routines));
}

// スケジュールの読み込み
function loadRoutines() {
  const savedRoutines = JSON.parse(localStorage.getItem('routines') || '[]');
  routines = savedRoutines;
  displayRoutines();
}

// スケジュールの表示
function displayRoutines() {
  routineList.innerHTML = '';
  routines
    .sort((a, b) => a.time.localeCompare(b.time)) // 時間順に並べ替え
    .forEach((routine) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${routine.time} - ${routine.task}</span>
        <button onclick="editRoutine(${routine.id})">編集</button>
        <button onclick="deleteRoutine(${routine.id})">削除</button>
      `;
      routineList.appendChild(li);
    });
}

// スケジュールの編集
function editRoutine(id) {
  const routine = routines.find((r) => r.id === id);
  if (routine) {
    const newTime = prompt('新しい時間を入力', routine.time);
    const newTask = prompt('新しいタスク内容を入力', routine.task);
    if (newTime) routine.time = newTime;
    if (newTask) routine.task = newTask;
    saveRoutines();
    displayRoutines();
  }
}

// スケジュールの削除
function deleteRoutine(id) {
  routines = routines.filter((r) => r.id !== id);
  saveRoutines();
  displayRoutines();
}

// 初期化
loadRoutines();