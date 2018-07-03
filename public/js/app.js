//render form when "Add note" clicked
$('.add-note').on('click', function () {
  let articleId = $(this).attr('data-id');

  //remove any comment forms before opening a new one
  $('.new-comment').remove();

  let comment = $(`<div class="new-comment" data-articleId=${articleId}>`);
  let html =
    `<form>
  <div class="form-group">
    <input type="text" class="form-control" id="comment-title" placeholder="Enter a title for your comment" data-articleId=${articleId}>
  </div>
  <div class="form-group">
    <textarea class="form-control" id="comment" rows="3" placeholder="Enter your comment here" data-articleId=${articleId}></textarea>
  </div>
  <div class="btn btn-primary btn-sm save-note" data-articleId=${articleId}><i class="fas fa-save"></i> Save comment</div>
  </form>`;

  comment.html(html);

  $(`.comments-wrapper[data-id=${articleId}]`)
    .prepend(comment);
});

//save comment when "Save comment" clicked
$(document).on("click", ".save-note", function () {
  var articleId = $(this).attr("data-articleId");

  let newComment = {
    title: $("#comment-title").val(),
    comment: $("#comment").val(),
    create_date: Date.now()
  };
  //console.log(newComment);

  //POST form elems
  $.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      title: $("#comment-title").val(),
      comment: $("#comment").val(),
      create_date: Date.now()
    }
  })
    .then(function (data) {
      console.log(data);
      location.reload();
    });

  //remove vals from form, remove form
  $("#comment-title").val("");
  $("#comment").val("");
  $('.new-comment').remove();
});

//unlock comment for editing
$(document).on('click', '.unlock-note', function () {
  let id = $(this).attr('data-noteid');

  $(`input[data-noteid=${id}]`).attr('readOnly', false);
  $(`textarea[data-noteid=${id}]`).attr('readOnly', false);
  //swap unlock button w save button
  $(`.unlock-note[data-noteid=${id}]`).hide();
  $(`.save-old-note[data-noteid=${id}]`).show();

});

//save comment when "Save comment" clicked
$(document).on("click", ".save-old-note", function () {
  var noteId = $(this).attr("data-noteId");

  let update = {
    _id: noteId,
    title: $(`input[data-noteid=${noteId}]`).val().trim(),
    comment: $(`textarea[data-noteid=${noteId}]`).val().trim(),
    create_date: Date.now()
  }

  //console.log("PUT", update);

  $.ajax("/notes/" + noteId,
    {
      type: "PUT",
      data: update
    }).then(function () {
      location.reload();
    })

  $(`input[data-noteid=${noteId}]`).attr('readOnly', true);
  $(`textarea[data-noteid=${noteId}]`).attr('readOnly', true);
  //swap save button w unlock button
  $(`.unlock-note[data-noteid=${noteId}]`).show();
  $(`.save-old-note[data-noteid=${noteId}]`).hide();


});

$(document).on('click', '.delete-note', function (event) {
  event.preventDefault();

  let deletion = {
    noteId: $(this).attr('data-noteId'),
    articleId: $(this).closest('.comments-wrapper').attr('data-id')
  }

  $.ajax("/notes/" + deletion.noteId,
    {
      type: "DELETE",
      data: deletion
    }).then(function () {
      location.reload();
    })

});

function scrape() {
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .then(function () {
      location.reload();
    });
}

$(document).on('load', function () {
  scrape();
})