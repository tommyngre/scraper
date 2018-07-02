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

  //POST form elems
  $.ajax({
    method: "POST",
    url: "/articles/" + articleId,
    data: {
      title: $("#comment-title").val(),
      comment: $("#comment").val()
    }
  })
    .then(function (data) {
      //console.log(data);
      location.reload();
    });

  //remove vals from form, remove form
  $("#comment-title").val("");
  $("#comment").val("");
  $('.comment').remove();
});

//unlock comment for editing
$(document).on('click', '.unlock-note, .save-old-note', function () {
  let id = $(this).attr('data-noteid');
  //if fields readOnly, make editable, vice verse
  if ($(`input[data-noteid=${id}]`).attr('readOnly')) {
    $(`input[data-noteid=${id}]`).attr('readOnly', false);
    $(`textarea[data-noteid=${id}]`).attr('readOnly', false);
    //swap unlock button w save button
    $(`.unlock-note[data-noteid=${id}]`).hide();
    $(`.save-old-note[data-noteid=${id}]`).show();
  } else {
    $(`input[data-noteid=${id}]`).attr('readOnly', true);
    $(`textarea[data-noteid=${id}]`).attr('readOnly', true);
    //swap unlock button w save button
    $(`.unlock-note[data-noteid=${id}]`).show();
    $(`.save-old-note[data-noteid=${id}]`).hide();
  }

});

//save comment when "Save comment" clicked
$(document).on("click", ".save-old-note", function () {
  var noteId = $(this).attr("data-noteId");

  let update = {
    _id: noteId,
    title: $(`input[data-noteid=${noteId}]`).val(),
    comment: $(`textarea[data-noteid=${noteId}]`).val()
  }

  //console.log("PUT", update);

  $.ajax("/notes/" + noteId,
    {
      type: "PUT",
      data: update
    }).then(function () {
      //location.reload();
    })

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

function scrape(){
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .then(function () {
      location.reload();
    });
}

$(document).ready(function () {
  //TODO
  //scrape on load
  //-duplicate-check
  //-load new to old

  //scrape();
})