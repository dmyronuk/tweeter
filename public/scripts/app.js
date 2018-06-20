/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function loadTweets(){
  $.ajax({
    url: "/tweets",
    dataType: "json",
    method: "GET",
    success: function(data){
      renderTweets(data);
    }
  })
};

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(data){
  let user = data.user;
  let content = data.content;
  let curTime = new Date();
  let daysElapsed = (curTime.getTime() - data.created_at) / (60 ** 2 * 24);
  let timeElapsedString = Math.round(daysElapsed) + " days ago";
  return `
    <section id="prev-tweets">
      <article class="tweet">
        <header>
          <img class="profile-img" src="${user.avatars.small}"/>
          <div>
            <h2>${escape(user.name)}</h2>
            <h4>${escape(user.handle)}</h4>
          </div>
        </header>
        <div>
          <section>${escape(content.text)}</section>
        </div>
        <footer>
          ${timeElapsedString}
          <img class="tweet-footer-img" src="/images/flag.png"/>
          <img class="tweet-footer-img" src="/images/retweet.png"/>
          <img class="tweet-footer-img" src="/images/heart.png"/>
        </footer>
      </article>
    </section>
  `
};

function renderTweets(dataArr){
  dataArr.forEach(elem => {
    var $tweet = $(createTweetElement(elem));
    $('#prev-tweets').prepend($tweet);
  })
};

function newTweetSubmitHandler(event){
  event.preventDefault();
  let $form = $(event.target).parent();
  let $textarea = $form.find("textarea");
  let text = $textarea.val().trim();
  let errMsg;
  if(!text){
    errMsg = "Please enter some text"
  }else if(text.length > 140){
    errMsg = "Character limit exceeded"
  }

  if(errMsg){
    $("#new-tweet-error").text(errMsg);
  }else{
    //clear textarea and error message
    $.ajax({
      url: "/tweets",
      data: $form.serialize(),
      method: "POST",
      success: function(){
        loadTweets();
      }
    })
  }
};

$(document).ready(function(){
  loadTweets();
  $(".new-tweet").find("input").on("click", newTweetSubmitHandler);
});


