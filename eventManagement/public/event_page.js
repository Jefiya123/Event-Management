window.addEventListener("load", () => {
});

function addTask(taskId, taskName,isDone,budget,subcoordinator) {

  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  const task_el = document.createElement("div");
  task_el.classList.add("task");

  const task_id = document.createElement("input");
  task_id.type = "hidden";
  task_id.value = taskId;
  task_id.id = "taskId";

  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el);

  const task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = taskName;
  task_input_el.setAttribute("readonly", "readonly");

  //task_content_el.appendChild(task_input_el);

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const task_check_el = document.createElement("input");
  task_check_el.classList.add("check");
  task_check_el.type = "checkbox";
  task_check_el.checked=(isDone=='true');
  task_check_el.name = "name";
  task_check_el.id = "id";
  task_check_el.disabled=true;

  const task_budget_el = document.createElement("input");
  task_budget_el.classList.add("budget");
  task_budget_el.type = "number";
  task_budget_el.placeholder = "Budget";
  task_budget_el.value= budget;
  task_budget_el.setAttribute("readonly","readonly");


  const task_sub_el = document.createElement("textarea");
  task_sub_el.classList.add("sub");
  // task_sub_el.type = 'textarea';
  task_sub_el.maxLength = "1000";
  task_sub_el.rows = "3";
  task_sub_el.cols = "40";
  task_sub_el.placeholder = "Subcoordinator";
  task_sub_el.innerText=subcoordinator;
  task_sub_el.setAttribute("readonly","readonly");

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerText = "Edit";

  const task_delete_el = document.createElement("button");
  task_delete_el.classList.add("delete");
  task_delete_el.innerText = "Delete";

  task_actions_el.appendChild(task_check_el);
  task_content_el.appendChild(task_input_el);
  
  task_actions_el.appendChild(task_budget_el);
  task_actions_el.appendChild(task_sub_el);
  task_actions_el.appendChild(task_edit_el);
  task_actions_el.appendChild(task_delete_el);

  task_el.appendChild(task_actions_el);
  task_el.appendChild(task_id);

  list_el.appendChild(task_el);

  task_edit_el.addEventListener("click", (e) => {
    console.log("Task id edit : " + task_id.value);
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_edit_el.innerText = "Save";
      task_input_el.removeAttribute("readonly");
      task_budget_el.removeAttribute("readonly");
      task_sub_el.removeAttribute("readonly");
	  task_check_el.disabled=false;
      task_input_el.focus();
    } else {
      task_edit_el.innerText = "Edit";
      task_input_el.setAttribute("readonly", "readonly");
	  task_budget_el.setAttribute("readonly","readonly");
	  task_sub_el.setAttribute("readonly","readonly");
	  task_check_el.disabled=true;
	  console.log("cheacked : "+task_check_el.checked);
	  console.log("Task id saved : " + task_id.value);

	  let repsonse = fetch("/user/manage-event/edit-task", {
		method: "PUT", // or 'PUT'
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({ taskId: task_id.value,taskName:task_input_el.value,isDone:task_check_el.checked,budget:task_budget_el.value,subcoordinator:task_sub_el.value}),
	  })
		.then((response) => response.json())
		.then((data) => {
		  console.log("Success:", data);
		  
		})
		.catch((error) => {
		  console.error("Error:", error);
		});
    }
  });

  task_delete_el.addEventListener("click", (e) => {
    let repsonse = fetch("/user/manage-event/delete-task", {
      method: "DELETE", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: task_id.value}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
		list_el.removeChild(task_el);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    
  });
}
