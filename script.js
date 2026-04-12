const checkbox = document.getElementById("complete-checkbox");
const todoTitle = document.getElementById("todo-title");
const todoStatus = document.getElementById("todo-status");
const timeRemaining = document.getElementById("time-remaining");
const dueDateElement = document.getElementById("due-date");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");

const updateTimeRemaining = () => {
  // Get the date from the 'datetime' attribute we set in HTML
  const dueDate = new Date(dueDateElement.getAttribute("datetime"));
  const now = new Date();
  const diffInMs = dueDate - now;

  let message = "";

  if (diffInMs <= 0) {
    const hoursPast = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60)));
    message = hoursPast === 0 ? "Due now!" : `Overdue by ${hoursPast} hours`;
  } else {
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days >= 1) {
      message = days === 1 ? "Due tomorrow" : `Due in ${days} days`;
    } else {
      message = `Due in ${hours} hours`;
    }
  }

  timeRemaining.textContent = message;
};

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    todoStatus.textContent = "Done";
    todoTitle.style.textDecoration = "line-through";
    todoTitle.style.color = "#888"; // Just a hint of style for feedback
  } else {
    todoStatus.textContent = "Pending";
    todoTitle.style.textDecoration = "none";
    todoTitle.style.color = "#000";
  }
});

editButton.addEventListener("click", () => {
  const newTitle = prompt("Edit To-Do Title:", todoTitle.textContent.trim());
  if (newTitle !== null && newTitle.trim() !== "") {
    todoTitle.textContent = newTitle.trim();
  }
});

deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this to-do?")) {
    // For simplicity, we'll just log the deletion into the console.
    console.log("To-Do item deleted");
  }
});

// 4. Initialize
updateTimeRemaining();

// Optional: Keep the time updated every minute
setInterval(updateTimeRemaining, 60000);
