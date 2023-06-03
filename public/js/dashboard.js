$(function () {
  $(document).on('click', '#addTask', function (event) {
    const id = `task-${Date.now() + Math.floor(Math.random() * 1e9)}`;
    $('#taskList').append(
      `<div class="d-flex mb-2" id="${id}"> 
       <div class="w-100 mr-2">
            <input type="text" placeholder="Type task" class="form-control wordCount" name="items" maxlength="100">
       </div>
       <div>
       <button type="button" class="btn btn-small btn-light removeTask" data-target="#${id}">
       <i class="fas fa-trash-alt"></i>
       </button>
       </div>
       </div>`
    );
  });

  $(document).on('click', '.removeTask', function (event) {
    const element = $(event.currentTarget);
    const { target } = element.data();

    $(`${target}`).remove();
  });
});
