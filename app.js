const routineForm = document.getElementById('routine-form');
const routineList = document.getElementById('routine-list');
let routines = [];
let dragSourceId = null; // ドラッグ中のアイテムID

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
      li.draggable = true; // ドラッグ可能
      li.classList.add('draggable');
      li.setAttribute('data-id', routine.id);
      li.addEventListener('dragstart', startDrag);
      li.addEventListener('dragover', dragOver);
      li.addEventListener('drop', dropItem);
      li.addEventListener('dragend', dragEnd);

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

// ドラッグ開始時の処理
function startDrag(event) {
  dragSourceId = event.target.getAttribute('data-id');
  event.target.classList.add('dragging');
}

// ドラッグオーバー時の処理（デフォルト動作を無効化）
function dragOver(event) {
  event.preventDefault();
}

// ドロップ時の処理
function dropItem(event) {
  event.preventDefault();
  const targetId = event.target.closest('li').getAttribute('data-id');
  const sourceIndex = routines.findIndex((r) => r.id === parseInt(dragSourceId, 10));
  const targetIndex = routines.findIndex((r) => r.id === parseInt(targetId, 10));

  if (sourceIndex !== -1 && targetIndex !== -1) {
    const [movedItem] = routines.splice(sourceIndex, 1); // 元の位置から削除
    routines.splice(targetIndex, 0, movedItem); // 新しい位置に挿入
    saveRoutines();
    displayRoutines();
  }
}

// ドラッグ終了時の処理
function dragEnd(event) {
  event.target.classList.remove('dragging');
}

// 初期化
loadRoutines();