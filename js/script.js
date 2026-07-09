const apiKey = "YOUR_REAL_API_KEY";

// ---------------- WEATHER APP ----------------

async function getWeather() {
    const city = document.getElementById("city").value;

    if (city.trim() === "") {
        alert("Please enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        document.getElementById("cityName").innerText = data.name;
        document.getElementById("temp").innerText =
            "🌡 Temperature: " + data.main.temp + " °C";
        document.getElementById("humidity").innerText =
            "💧 Humidity: " + data.main.humidity + "%";
        document.getElementById("wind").innerText =
            "🌬 Wind Speed: " + data.wind.speed + " m/s";
        document.getElementById("description").innerText =
            data.weather[0].description;

        document.getElementById("icon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        localStorage.setItem("lastCity", city);

    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}

// ---------------- TODO APP ----------------

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");

    if (input.value.trim() === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text: input.value.trim(),
        completed: false
    });

    input.value = "";

    saveTasks();
    displayTasks(currentFilter);
}

function displayTasks(filter = "all") {

    currentFilter = filter;

    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach((task, index) => {

        if (filter === "active" && task.completed) return;
        if (filter === "completed" && !task.completed) return;

        const li = document.createElement("li");

        li.innerHTML = `
            <span onclick="toggleTask(${index})"
            style="cursor:pointer; ${task.completed ? 'text-decoration:line-through;color:gray;' : ''}">
                ${task.text}
            </span>

            <div>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks(currentFilter);
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks(currentFilter);
}

function editTask(index) {
    const newTask = prompt("Edit Task", tasks[index].text);

    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].text = newTask.trim();
        saveTasks();
        displayTasks(currentFilter);
    }
}

window.onload = function () {
    const savedCity = localStorage.getItem("lastCity");

    if (savedCity) {
        document.getElementById("city").value = savedCity;
        getWeather();
    }

    displayTasks(currentFilter);
};
