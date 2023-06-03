$(function () {
  const todoId = $('#todoID').val();
  $(document).on('click', '#addTask', function (event) {
    const id = Date.now() + Math.floor(Math.random() * 1e9);
    $('#todoTasks').append(
      `<div class="d-flex mb-2" id="${id}"> 
        <div class="w-100 mr-2">
             <input type="text" placeholder="Type task" class="form-control wordCount" maxlength="100">
        </div>
        <div>
        <button type="button" class="btn btn-small btn-light saveTask" data-target="#${id}">
            Save
        </button>
        </div>
        </div>`
    );
  });

  $(document).on('click', '.saveTask', function (event) {
    const element = $(event.currentTarget);
    const { target } = element.data();
    const task = $('input', target).val();

    if (task) {
      $.post(`/todos/${todoId}/items`, { task, todoId }, function (item) {
        if (item) {
          $(target).remove();
          $('#todoTasks').append(
            `
                <li class="mb-2">
                <div class="d-flex dropdown">
                    <div class="mr-2 align-self-start">
                        <button class="btn btn-transparent btn-sm" data-toggle="dropdown">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>

                        <ul class="dropdown-menu app-menu">
                            <li>
                                <a class="dropdown-item editTask" data-id="${
                                  item.id
                                }">
                                    <i class="fas fa-pen mr-2"></i>
                                    Edit
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item deleteTask" data-id="${
                                  item.id
                                }">
                                    <i class="fas fa-trash-alt mr-2"></i>
                                    Delete
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="align-self-center" id="task-${item.id}">
                        <div class="custom-control custom-checkbox" id="taskContent-${
                          item.id
                        }">
                            <input type="checkbox" class="custom-control-input toggleTask"
                                id="task-done-${item.id}" ${
              item.done ? 'checked' : ''
            }>
                            <label for="task-done-${
                              item.id
                            }" class="custom-control-label mb-0">
                                ${item.task}
                            </label>
                        </div>
                    </div>
                </div>
            </li>
                `
          );
        }
      });
    }
  });

  $(document).on('click', '.editTask', function (event) {
    const element = $(event.currentTarget);
    const { id } = element.data();
    const taskPane = $(`#task-${id}`);
    const taskContent = $(`#taskContent-${id}`);
    const task = $('label', taskContent).text().trim();
    const editId = `editTask-${Date.now() + Math.floor(Math.random() * 1e9)}`;
    taskContent.addClass('d-none');
    if (taskPane.data().edit) {
      $(`#${taskPane.data().edit}`).remove();
      taskContent.removeClass('d-none');
      taskPane.removeData('edit');
      return;
    }

    taskPane.data('edit', editId);
    taskPane.append(
      `<div class="d-flex mb-2" id="${editId}"> 
        <div class="w-100 mr-2">
             <input type="text" placeholder="Type task" class="form-control wordCount" value="${task}" maxlength="100">
        </div>
        <div>
        <button type="button" class="btn btn-small btn-light updateTask" data-target="#${editId}" data-id="${id}">
            Save
        </button>
        </div>
        </div>`
    );
  });

  $(document).on('click', '.updateTask', function (event) {
    const element = $(event.currentTarget);
    const { target, id } = element.data();
    const task = $('input', target).val();

    if (task) {
      $.post(`/todos/items/${id}`, { task, _method: 'PUT' }, function (item) {
        if (item) {
          const taskPane = $(`#task-${item.id}`);
          const taskContent = $(`#taskContent-${item.id}`);
          $('label', taskContent).html(item.task);
          taskContent.removeClass('d-none');
          taskPane.removeData('edit');
          $(target).remove();
        }
      });
    }
  });

  $(document).on('click', '.deleteTask', function (event) {
    const element = $(event.currentTarget);
    const { id } = element.data();

    if (element.delete) {
      return;
    }
    element.data('delete', id);
    $.post(`/todos/items/${id}`, { _method: 'DELETE' }, function (response) {
      $(`#taskContainer-${id}`).remove();
    });
  });

  $(document).on('change', '.toggleTask', function (event) {
    const element = $(event.currentTarget);
    const { id } = element.data();
    const done = element.prop('checked');

    let api = `/todos/items/${id}/`;
    if (element.processing) {
      return;
    }
    element.data('processing', id);
    api += done ? 'done' : 'undone';
    $.post(api, { _method: 'PUT' }, function (response) {
      if (done) $(`#task-done-${id}+label`).addClass('task-done');
      else $(`#task-done-${id}+label`).removeClass('task-done');
    });
  });

  $(document).on('click', '#editTodo', function (event) {
    event.preventDefault();
    const element = $(event.currentTarget);
    if (element.data().edit) return;
    const todoPane = $('#todoPane');
    const todoContent = $('#todoContent');
    const text = todoContent.text().trim();
    todoContent.addClass('d-none');

    element.data('edit', true);
    todoPane.append(`
    <div class="d-flex mb-2 w-100" id="todoEditPane"> 
      <div class="w-100 mr-2">
            <input type="text" placeholder="Type task" class="form-control wordCount" value="${text}" maxlength="100">
      </div>
      <div>
        <button type="button" class="btn btn-small btn-light" id="updateTodo">
            Save
        </button>
      </div>
    </div>
    `);
  });

  $(document).on('click', '#updateTodo', function (event) {
    event.preventDefault();
    const todoEditPane = $('#todoEditPane');
    const todoContent = $('#todoContent');
    const editBtn = $('#editTodo');
    const title = $('input', todoEditPane).val();

    $.post(`/todos/${todoId}`, { _method: 'PUT', title }, function (response) {
      todoEditPane.remove();
      todoContent.text(response.title);
      todoContent.removeClass('d-none');
      editBtn.removeData('edit');
    });
  });

  $(document).on('click', '#deleteTodo', function (event) {
    event.preventDefault();

    $.post(`/todos/${todoId}`, { _method: 'DELETE' }, function (response) {
      document.location.href = '/dashboard';
    });
  });
});
