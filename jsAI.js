// Selecting DOM elements for the task form and modal dialogs
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");

// Selecting DOM elements for task display and input fields
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// Retrieve data from localStorage (parsing JSON string to array) or default to an empty array
const taskData = JSON.parse(localStorage.getItem("data")) || [];
// Object to keep track of the task currently being edited
let currentTask = {};

// Helper function to remove non-alphanumeric characters (except dashes/spaces) for clean IDs
const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, "");
};

// Main function to handle adding a new task or updating an existing one
const addOrUpdateTask = () => {
  // Validate that the title is not empty
  if (!titleInput.value.trim()) {
    alert("Please provide a title");
    return;
  }

  // Check if currentTask exists in the data array to determine if this is an update or a new task
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  // Create a new task object with a unique ID based on title and current timestamp
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value)
      .toLowerCase()
      .split(" ")
      .join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

  // If the task is new (index -1), add it to the start of the array
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    // If it's an update, replace the existing task at that index
    taskData[dataArrIndex] = taskObj;
  }

  // Save the updated array back to localStorage
  localStorage.setItem("data", JSON.stringify(taskData));
  // Refresh the UI to show the tasks
  updateTaskContainer();
  // Clear the form and reset state
  reset();
};

// Function to render all tasks in the HTML container
const updateTaskContainer = () => {
  // Clear the container before re-rendering
  tasksContainer.innerHTML = "";

  // Loop through task data and generate HTML for each task card
  taskData.forEach(({ id, title, date, description }) => {
    tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask(this)" type="button" class="btn">Edit</button>
          <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
        </div>
      `;
  });
};

// Function to delete a task based on the button clicked
const deleteTask = (buttonEl) => {
  // Find the index of the task by looking at the parent element's ID
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Remove the task from the DOM immediately
  buttonEl.parentElement.remove();
  // Remove the task from the data array
  taskData.splice(dataArrIndex, 1);
  // Update localStorage to reflect the deletion
  localStorage.setItem("data", JSON.stringify(taskData));
};

// Function to populate the form with existing task data for editing
const editTask = (buttonEl) => {
  // Find the specific task in the data array
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  // Store the task being edited in currentTask
  currentTask = taskData[dataArrIndex];

  // Fill input fields with the task's current values
  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  // Change button text to indicate an update instead of a new entry
  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the form
  taskForm.classList.toggle("hidden");
};

// Function to clear input fields and hide the form
const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {}; // Reset the editing tracker
};

// Initial check: if there is saved data, display it on page load
if (taskData.length) {
  updateTaskContainer();
}

// Event: Open the task form when the "Add New Task" button is clicked
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// Event: Handle closing the form and checking for unsaved changes
closeTaskFormBtn.addEventListener("click", () => {
  // Check if any fields have text in them
  const formInputsContainValues =
    titleInput.value || dateInput.value || descriptionInput.value;

  // Check if the current input is different from the original task data
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.date ||
    descriptionInput.value !== currentTask.description;

  // If there are unsaved changes, show the confirmation dialog
  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    // Otherwise, just close/reset the form
    reset();
  }
});

// Event: Close the "Unsaved Changes" modal without discarding
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// Event: Discard changes, close the modal, and reset the form
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

// Event: Handle form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload on submit

  addOrUpdateTask();
});
