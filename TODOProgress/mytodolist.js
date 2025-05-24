function loadData() {
  const savedData = localStorage.getItem("todo-list-data");
  if (savedData) {
    todoLists = JSON.parse(savedData);
    // Ensure each day has an array even if the saved data doesn't include it
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    days.forEach((day) => {
      if (!todoLists[day]) {
        todoLists[day] = [];
      }
    });
  } else {
    // If no saved data, ensure todoLists is initialized correctly
    todoLists = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
  }
  console.log("Loaded todoLists from localStorage:", todoLists);
}
let titleElement = document.querySelector(".js-todo-title");

function updateTitle() {
  if (titleElement) {
    titleElement.textContent = selectedDay;
  }
}

function selectDay(day) {
  selectedDay = day;
  updateTitle();
  let buttons = document.querySelectorAll(".day-button");
  buttons.forEach((button) => {
    if (button.classList.contains(day)) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });

  localStorage.setItem("selectedDay", day);
  showTodoList(selectedDay);
}
document.addEventListener("DOMContentLoaded", function () {
  titleElement = document.querySelector(".js-todo-title"); // Select the title element after DOM is loaded
  loadData();

  // Load the last selected day or default to 'Monday'
  const lastSelectedDay = localStorage.getItem("selectedDay") || "Monday";
  selectDay(lastSelectedDay);

  updateTitle();

  // Attach event listeners to detect changes in the contenteditable elements
  document
    .querySelector(".js-todo-list")
    .addEventListener("input", function (event) {
      if (event.target.classList.contains("js-todo-item")) {
        const index = Array.from(event.target.parentNode.children).indexOf(
          event.target
        );
        const taskText = event.target.textContent.replace("◦", ""); // Remove bullet and whitespace
        todoLists[selectedDay][index] = taskText;
        saveData();
      }
    });
  document
    .querySelector(".js-todo-list")
    .addEventListener("keydown", function (event) {
      if (event.target.classList.contains("js-todo-item")) {
        changeTask(event); // Enter tuşuna basıldığında hiçbir şey yapma
      }
    });
});

function saveData() {
  localStorage.setItem("todo-list-data", JSON.stringify(todoLists));
  console.log("Saved todoLists to localStorage:", todoLists);
}
/*function loadData() {
  const savedData = localStorage.getItem('todo-list-data');
  if (savedData) {
    todoLists = JSON.parse(savedData);
  }
  console.log('Loaded todoLists from localStorage:', todoLists);
}
*/

function getInput() {
  const inputHTML =
    '<input placeholder="TO-DO" class="js-get-tasks get-tasks" onkeydown="pressEnter(event)">';

  document.querySelector(".js-inputContainer").innerHTML += inputHTML;
}

function showTodoList(day) {
  console.log(todoLists);
  if (!todoLists.hasOwnProperty(day)) {
    console.error(`Error: ${day} is not a valid day.`);
    return;
  }

  let todoList = todoLists[day];
  let todolistHTML = "";

  for (let i = 0; i < todoList.length; i++) {
    let todoElem = todoList[i];
    let statusClass =
      getCookie(`${day}-todo-item-${i}`) === "done" ? "done" : "undone";

    let html = `
      <div class="js-todo-item todo-item ${statusClass}" contenteditable="true" data-day="${day}">&#9702; ${todoElem}
         
        <div class="js-check check"> 
          <button class="check-button" onclick="markAsDone('${day}', ${i}, this.parentElement.parentElement)">
            <img src="tick.png" alt="Icon">
          </button> 
        </div>

        <div class="js-delete delete"> 
          <button class="delete-button" onclick="deleteTask('${day}', ${i})">
            <img src= "minus.png" alt="Icon">
          </button> 
        </div>

        <div class="js-next next"> 
          <button class="next-button" onclick="postpone('${day}', ${i})">
            <img src= "right-arrow.png" alt="Icon">
          </button> 
        </div>

        
      </div>
    `;
    todolistHTML += html;
  }

  document.querySelector(".js-todo-list").innerHTML = todolistHTML;
  addProgress(day);
  saveData();
}

function addTodo() {
  const inputElement = document.querySelector(".js-get-tasks");
  const task = inputElement.value;
  console.log("Selected day:", selectedDay);
  console.log("Todo list for the day:", todoLists[selectedDay]);
  if (task !== "" && selectedDay) {
    todoLists[selectedDay].push(task);
  }
  inputElement.value = "";

  showTodoList(selectedDay);
  saveData();
}

function pressEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
}

function deleteTask(day, index) {
  let todoList = todoLists[day];

  deleteCookie(`${day}-todo-item-${index}`);

  todoList.splice(index, 1);

  for (let i = index; i < todoList.length; i++) {
    let status = getCookie(`${day}-todo-item-${i + 1}`);
    deleteCookie(`${day}-todo-item-${i + 1}`);
    setCookie(`${day}-todo-item-${i}`, status, 7);
  }

  showTodoList(day);
}
/*function deleteTask(day, index) {
  let removed = document.querySelector(`.js-todo-item:nth-child(${toDelete + 1})`);
  let nextItem = document.querySelector(`.js-todo-item:nth-child(${toDelete + 2})`);
  let prevItem = document.querySelector(`.js-todo-item:nth-child(${toDelete})`);

  let removedStatus = removed && removed.classList.contains('done');
  let nextStatus = nextItem && nextItem.classList.contains('done');
  let prevStatus = prevItem && prevItem.classList.contains('done');

  // Görev listesinden öğeyi sil
  todoList.splice(day, 1);

  // Cookie'yi sil
  deleteCookie(`todo-item-${day}`);

  // Eğer DOM'dan kaldırılacak bir öğe varsa, onu DOM'dan kaldır
  if (removed) {
    removed.remove();
  }

  // Eğer silinen görev 'done' ise, bir sonraki görevi 'undone' yap
  if (removedStatus && toDelete < todoList.length) {
    if ((nextItem) && !nextStatus) {
      nextItem.classList.remove('done');
      nextItem.classList.add('undone');
    }
  }

  // Eğer silinen görev 'undone' ise, bir önceki görevi 'done' yap
  if (!removedStatus && toDelete > 0) {
    if ((prevItem) && prevStatus) {
      prevItem.classList.remove('done');
      prevItem.classList.add('undone');
      setCookie(`todo-item-${toDelete - 1}`, 'done', 7);
    }
  }

  // Kalan öğelerin cookie'lerini güncelle
  for (let i = toDelete; i < todoList.length; i++) {
    let status = getCookie(`todo-item-${i + 1}`);
    deleteCookie(`todo-item-${i + 1}`);
    setCookie(`todo-item-${i}`, status, 7);
  }

  showTodoList(day);
}
*/

//1 tane taradiysan ise yariyor, 2 tane taradiysan bunlar hep kaliyor. Sonsuza
//kadar tarayabilecegimiz icin bu islem yerine baska bir algoritma bul.
//HATA2: Bir eleman kalinca silmiyor, ilk eleman taranmamışsa onu da silmiyor.

function markAsDone(day, index, element) {
  // const parentElement = element.parentElement;
  // const todoItemElement = parentElement.querySelector('.js-todo-item');
  if (!element) {
    console.error("Cannot find todo item element");
    return;
  }

  if (element.classList.contains("undone")) {
    element.classList.remove("undone");
    element.classList.add("done");
    setCookie(`${day}-todo-item-${index}`, "done", 7); // 7 gün geçerlilik süresi ile kaydet
  } else {
    element.classList.remove("done");
    element.classList.add("undone");
    setCookie(`${day}-todo-item-${index}`, "undone", 7); // 7 gün geçerlilik süresi ile kaydet
  }

  addProgress(day);
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  // Tüm günler için görev durumlarını yükle
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  days.forEach((day) => {
    let todoItems = document.querySelectorAll(
      `.js-todo-item[data-day="${day}"]`
    );
    todoItems.forEach((item, index) => {
      let status = getCookie(`${day}-todo-item-${index}`);
      if (status === "done") {
        item.classList.add("done");
        item.classList.remove("undone");
      } else {
        item.classList.add("undone");
        item.classList.remove("done");
      }
    });
  });
}); // Sayfa yüklendiğinde durumları yükle
/*document.addEventListener('DOMContentLoaded', function() {
  let todoItems = document.querySelectorAll('.js-todo-item');
  todoItems.forEach((item, index) => {
    let status = getCookie(`todo-item-${index}`);
    if (status === 'done') {
      item.classList.add('done');
      item.classList.remove('undone');
    } else {
      item.classList.add('undone');
      item.classList.remove('done');
    }
  });

});
*/
function addProgress(day) {
  let doneCount = document.querySelectorAll(".js-todo-item.done").length;
  let totalCount = todoLists[day].length;
  let percent = totalCount === 0 ? 0 : (doneCount / totalCount) * 100;
  let formattedPercent = percent.toFixed(0);

  if (totalCount === 0 || doneCount === 0) {
    document.querySelector(".js-progress").innerHTML = `0%`;
    document.querySelector(".progress").style.display = `none`;
    document.querySelector(".progress-bar").style.display = `none`;
    return;
  }

  document.querySelector(".progress").style.display = "flex";
  document.querySelector(".progress-bar").style.display = "block";

  document.querySelector(".js-progress").innerHTML = `${formattedPercent}%`; //virgülsüz hale getirdik.
  document.querySelector(".progress").style.width = `${percent}%`;

  progressPercent = formattedPercent;
  saveData(); // Veri kaydetme fonksiyonunu çağır
}

document.addEventListener("DOMContentLoaded", function () {
  selectDay(selectedDay); // Sayfa yüklendiğinde varsayılan olarak 'monday' gününü seç ve to-do listesini göster

  // Başlığı cookie'den yükle
  let storedTitle = getCookie("todo-title");
  if (storedTitle) {
    let titleElement = document.querySelector(".js-todo-title");
    if (titleElement) {
      titleElement.textContent = storedTitle;
    }
  }

  // Başlık değişikliğini cookie'ye kaydet
  if (titleElement) {
    titleElement.addEventListener("input", function () {
      document.cookie = `title=${encodeURIComponent(title)}; path=/`;
    });
  }
});

function postpone(day, index) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Mevcut günün indeksini bul
  let currentDayIndex = days.indexOf(day);

  // Bir sonraki günü belirle (Pazar gününden sonra Pazartesi'ye dön)
  let nextDayIndex = (currentDayIndex + 1) % days.length;
  let nextDay = days[nextDayIndex];

  // Mevcut günden görevi al
  let task = todoLists[day][index];

  // Görevi bir sonraki güne ekle
  todoLists[nextDay].push(task);

  // Mevcut günden görevi sil
  todoLists[day].splice(index, 1);
  showTodoList(day); // Mevcut günün listesini güncelle

  // Güncellenen todo listelerini göster
  saveData(); // Veriyi kaydet
}
// Cookie yazma fonksiyonu
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

// Cookie okuma fonksiyonu
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

// Cookie silme fonksiyonu
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function clearAllTasks() {
  // Tüm görevleri ve cookie'leri sil
  for (let i = 0; i < todoList.length; i++) {
    deleteCookie(`todo-item-${i}`);
  }
}

function changeTask(event) {
  if (event.key == "Enter") {
    //Enter fonksiyonunu engeller.
    event.preventDefault();
    return;
  }
}
