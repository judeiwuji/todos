$(function () {
  $(document).on('keyup', '.wordCount', function (event) {
    const element = $(event.currentTarget);
    const text = element.val();
    element.nextAll().remove();
    element.after(
      `<span class="count-label">
      ${text.length}/${element.attr('maxlength')}
      </span>`
    );
  });
});
