// const checkbox = document.getElementById("complete-checkbox");
// const todoTitle = document.getElementById("todo-title");
// const todoStatus = document.getElementById("todo-status");
// const timeRemaining = document.getElementById("time-remaining");
// const dueDateElement = document.getElementById("due-date");
// const editButton = document.getElementById("edit-button");
// const deleteButton = document.getElementById("delete-button");

// const updateTimeRemaining = () => {
//   // Get the date from the 'datetime' attribute we set in HTML
//   const dueDate = new Date(dueDateElement.getAttribute("datetime"));
//   const now = new Date();
//   const diffInMs = dueDate - now;

//   let message = "";

//   if (diffInMs <= 0) {
//     const hoursPast = Math.abs(Math.floor(diffInMs / (1000 * 60 * 60)));
//     message = hoursPast === 0 ? "Due now!" : `Overdue by ${hoursPast} hours`;
//   } else {
//     const hours = Math.floor(diffInMs / (1000 * 60 * 60));
//     const days = Math.floor(hours / 24);

//     if (days >= 1) {
//       message = days === 1 ? "Due tomorrow" : `Due in ${days} days`;
//     } else {
//       message = `Due in ${hours} hours`;
//     }
//   }

//   timeRemaining.textContent = message;
// };

// checkbox.addEventListener("change", () => {
//   if (checkbox.checked) {
//     todoStatus.textContent = "Done";
//     todoTitle.style.textDecoration = "line-through";
//     todoTitle.style.color = "#888"; // Just a hint of style for feedback
//   } else {
//     todoStatus.textContent = "Pending";
//     todoTitle.style.textDecoration = "none";
//     todoTitle.style.color = "#000";
//   }
// });

// editButton.addEventListener("click", () => {
//   const newTitle = prompt("Edit To-Do Title:", todoTitle.textContent.trim());
//   if (newTitle !== null && newTitle.trim() !== "") {
//     todoTitle.textContent = newTitle.trim();
//   }
// });

// deleteButton.addEventListener("click", () => {
//   if (confirm("Are you sure you want to delete this to-do?")) {
//     // For simplicity, we'll just log the deletion into the console.
//     console.log("To-Do item deleted");
//   }
// });

// // 4. Initialize
// updateTimeRemaining();

// // Optional: Keep the time updated every minute
// setInterval(updateTimeRemaining, 60000);

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. THE STATE (The Single Source of Truth)
  // ==========================================
  let state = {
    task: {
      title: "Submit Stage 0 Task",
      description:
        "Complete the HNG internship frontend task using Vanilla JS. This text might get very long so we need to ensure it can collapse and expand properly based on user interaction to keep the UI clean.",
      status: "Pending", // "Pending", "In Progress", "Done"
      priority: "High", // "Low", "Medium", "High"
      dueDate: "2026-04-16T23:59:59+01:00",
      tags: ["work", "urgent"],
    },
    ui: {
      isEditing: false,
      isExpanded: false,
    },
  };

  // ==========================================
  // 2. CACHE DOM ELEMENTS (Grab them once)
  // ==========================================
  // Card & Views
  const card = document.getElementById("task-card");
  const displayView = document.getElementById("display-view");
  const editForm = document.getElementById("edit-form");

  // Display Elements
  const displayTitle = document.getElementById("display-title");
  const displayDesc = document.getElementById("display-desc");
  const displayPriority = document.getElementById("display-priority");
  const svgHigh = document.getElementById("svg-high");
  const svgMedium = document.getElementById("svg-medium");
  const svgLow = document.getElementById("svg-low");
  const priorityText = document.getElementById("priority-text");
  const statusControl = document.getElementById("status-control");
  const completeCheckbox = document.getElementById("complete-checkbox");
  const displayTags = document.getElementById("display-tags");

  // Time Elements
  const displayDate = document.getElementById("display-date");
  const timeRemaining = document.getElementById("time-remaining");
  const overdueBadge = document.getElementById("overdue-badge");

  // Expand/Collapse Elements
  const descContainer = document.getElementById("desc-container");
  const expandBtn = document.getElementById("expand-btn");

  // Edit Form Inputs
  const editTitle = document.getElementById("edit-title");
  const editDesc = document.getElementById("edit-desc");
  const editPriority = document.getElementById("edit-priority");
  const editDate = document.getElementById("edit-date");
  const editTags = document.getElementById("edit-tags");

  // Buttons
  const btnEdit = document.getElementById("edit-button");
  const btnCancel = document.getElementById("cancel-button");
  const btnDelete = document.getElementById("delete-button");

  // ==========================================
  // 3. THE RENDER FUNCTION (The Workhorse)
  // ==========================================
  function render() {
    // A. Toggle Views based on UI State
    if (state.ui.isEditing) {
      displayView.classList.add("hidden");
      editForm.classList.remove("hidden");

      // Populate form with current state
      editTitle.value = state.task.title;
      editDesc.value = state.task.description;
      editPriority.value = state.task.priority;
      editDate.value = state.task.dueDate.slice(0, 16); // Formats for datetime-local
      editTags.value = state.task.tags.join(", ");
      return; // Stop rendering display stuff if we are editing
    } else {
      displayView.classList.remove("hidden");
      editForm.classList.add("hidden");
    }

    // B. Update Text content
    displayTitle.textContent = state.task.title;
    displayDesc.textContent = state.task.description;

    // C. Sync Checkbox and Status Dropdown
    statusControl.value = state.task.status;
    completeCheckbox.checked = state.task.status === "Done";

    // D. "Done" State Visuals
    if (state.task.status === "Done") {
      card.classList.add("is-done");
    } else {
      card.classList.remove("is-done");
    }

    // E. Update the text span only (protects the SVGs)
    priorityText.textContent = state.task.priority;

    // Hide all SVGs first
    svgHigh.classList.add("hidden");
    svgMedium.classList.add("hidden");
    svgLow.classList.add("hidden");

    // Unhide the correct SVG and apply the correct background color
    if (state.task.priority === "High") {
      svgHigh.classList.remove("hidden");
      displayPriority.className = "priority-badge priority-high";
    } else if (state.task.priority === "Medium") {
      svgMedium.classList.remove("hidden");
      displayPriority.className = "priority-badge priority-medium";
    } else {
      svgLow.classList.remove("hidden");
      displayPriority.className = "priority-badge priority-low";
    }

    // F. Expand/Collapse Logic
    // Only show the "Read More" button if description is long enough (> 100 chars)
    if (state.task.description.length > 100) {
      expandBtn.classList.remove("hidden");
      if (state.ui.isExpanded) {
        descContainer.classList.replace("desc-collapsed", "desc-expanded");
        expandBtn.textContent = "Show Less";
        expandBtn.setAttribute("aria-expanded", "true");
      } else {
        descContainer.classList.replace("desc-expanded", "desc-collapsed");
        expandBtn.textContent = "Read More";
        expandBtn.setAttribute("aria-expanded", "false");
      }
    } else {
      expandBtn.classList.add("hidden");
      descContainer.className = "desc-expanded"; // Always show full if it's short
    }
    // Render Tags Dynamically (Display Mode Only)
    displayTags.innerHTML = ""; // Clear old tags
    state.task.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;

      // Apply color classes based on the word
      const lowerTag = tag.toLowerCase();
      if (lowerTag === "work") li.classList.add("tag-work");
      else if (lowerTag === "urgent") li.classList.add("tag-urgent");
      else if (lowerTag === "home") li.classList.add("tag-home");
      else if (lowerTag === "fun") li.classList.add("tag-fun");
      else li.classList.add("tag-default");

      // Add the HNG testid
      li.setAttribute("data-testid", `test-todo-tag-${lowerTag}`);

      displayTags.appendChild(li);
    });

    // G. Trigger Time Update
    updateTimeLogic();
  }

  // ==========================================
  // 4. THE TIME LOGIC (Granular & Overdue rules)
  // ==========================================
  function updateTimeLogic() {
    // Format static date (e.g., Due Apr 16, 2026)
    const dueDateObj = new Date(state.task.dueDate);
    displayDate.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Due ${dueDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    // If done, stop everything and show completed
    if (state.task.status === "Done") {
      timeRemaining.textContent = "Completed";
      timeRemaining.style.color = "#10b981"; // Success green
      overdueBadge.classList.add("hidden");
      return;
    }

    // Calculate granular time remaining
    const now = new Date();
    const diffMs = dueDateObj - now;
    const isOverdue = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Reset default styling
    timeRemaining.style.color = "#4b5563";

    if (isOverdue) {
      overdueBadge.classList.remove("hidden");
      timeRemaining.style.color = "#ef4444"; // Red accent for overdue text
      if (days > 0)
        timeRemaining.textContent = `Overdue by ${days} day${days > 1 ? "s" : ""}`;
      else if (hours > 0)
        timeRemaining.textContent = `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
      else
        timeRemaining.textContent = `Overdue by ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      overdueBadge.classList.add("hidden");
      if (days > 1) timeRemaining.textContent = `Due in ${days} days`;
      else if (days === 1) timeRemaining.textContent = `Due tomorrow`;
      else if (hours > 0)
        timeRemaining.textContent = `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
      else
        timeRemaining.textContent = `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  // Set the interval to check the time every 60 seconds
  setInterval(() => {
    if (state.task.status !== "Done") updateTimeLogic();
  }, 60000);

  // ==========================================
  // 5. EVENT LISTENERS (Triggering State Changes)
  // ==========================================

  // Open Edit Mode
  btnEdit.addEventListener("click", () => {
    state.ui.isEditing = true;
    render();
  });

  // Cancel Edit Mode
  btnCancel.addEventListener("click", () => {
    state.ui.isEditing = false;
    render();
    btnEdit.focus(); // A11y: Return focus to edit button
  });

  // Save Edit Form
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Update the brain with new values
    state.task.title = editTitle.value;
    state.task.description = editDesc.value;
    state.task.priority = editPriority.value;
    state.task.dueDate = new Date(editDate.value).toISOString();
    // Split by commas, trim spaces, and remove empty strings
    state.task.tags = editTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    state.ui.isEditing = false;
    render();
    btnEdit.focus(); // A11y: Return focus to edit button
  });

  // Checkbox Sync
  completeCheckbox.addEventListener("change", (e) => {
    if (e.target.checked) {
      state.task.status = "Done";
    } else {
      // Revert to pending if unchecked
      state.task.status = "Pending";
    }
    render();
  });

  // Status Dropdown Sync
  statusControl.addEventListener("change", (e) => {
    state.task.status = e.target.value;
    render();
  });

  // Expand / Collapse Toggle
  expandBtn.addEventListener("click", () => {
    state.ui.isExpanded = !state.ui.isExpanded;
    render();
  });

  // Delete Task
  btnDelete.addEventListener("click", () => {
    // Standard browser confirmation popup
    const isConfirmed = confirm("Are you sure you want to delete this task?");

    if (isConfirmed) {
      // Find the main container
      const container = document.querySelector(".container") || document.body;

      // Physically removes the entire card from the HTML
      card.remove();

      // Add a nice "Empty State" message
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent =
        "Task successfully deleted. Refresh the page to reset.";
      emptyMessage.style.color = "#6b7280";
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.marginTop = "40px";

      container.appendChild(emptyMessage);
    }
  });

  // ==========================================
  // 6. INITIALIZATION
  // ==========================================
  render(); // Kick off the first render to paint the screen
});
