/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

function loadTweets(newestIndex, oldestIndex){
  $.ajax({
    url: "/tweets",
    dataType: "json",
    method: "GET",
    success: function(data){
      if(newestIndex === undefined) newestIndex = 0;
      if(oldestIndex === undefined) oldestIndex = data.length - 1;
      renderTweets(data, newestIndex, oldestIndex);
    }
  })
};

function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//takes a time int and return a string for display in html
function formatTimeElapsed(created_at){
  let curDate = new Date();
  let createdDate = new Date(created_at);
  let diffMinutes = (curDate.getTime() - createdDate.getTime()) / (1000 * 60);
  let diffHours = diffMinutes / 60;
  let diffDays = diffHours / 24;
  let diffMonths = diffDays / 365 * 12;

  if(diffMinutes < 1){
    return "just now";
  }else if(diffMinutes > 0 && diffMinutes < 60){
    outElem = [Math.round(diffMinutes), "minute"];
  }else if (diffHours < 24){
    outElem = [Math.round(diffHours), "hour"];
  }else if (diffDays < 31){
    outElem = [Math.round(diffDays), "day"];
  }else if (diffMonths < 12){
    outElem = [Math.round(diffMonths), "month"];
  }else if (diffMonths > 12){
    let yearsElapsed = curDate.getFullYear() - createdDate.getFullYear();
    outElem = [yearsElapsed, "year"];
  }

  let suffix = outElem[0] === 1 ? "" : "s";
  return `${outElem[0]} ${outElem[1]}${suffix} ago`;
};

function createTweetElement(data){
  let user = data.user;
  let content = data.content;
  let timeElapsedString = formatTimeElapsed(data.created_at);
  // let timeElapsedString = Math.round(daysElapsed) + " days ago";
  return `
    <section id="prev-tweets">
      <article class="tweet">
        <header>
          <img class="profile-img" src="${user.avatars.small}"/>
          <div class="tweet-headings-container">
            <div>
              <h2>${escape(user.name)}</h2>
            </div>
            <div class="user-handle">
              <h4>${escape(user.handle)}</h4>
            </div>
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

function renderTweets(dataArr, newestIndex, oldestIndex){
  /* Array is sorted from newest at index 0 to oldest at index arr.length - 1
  We're going to start with the post at oldestIndex, prepend it to the container
  and work backwords towards the post at newestIndex
  */
  for(let i = oldestIndex; i >= newestIndex; i--){
    var $tweet = $(createTweetElement(dataArr[i]));
    $('#prev-tweets').prepend($tweet);
  }
};

function newTweetSubmitHandler(event){
  event.preventDefault();
  let $form = $(event.target).parent();
  let $textarea = $form.find("textarea");
  let text = $textarea.val().trim();
  let errMsg;
  if(!text){
    errMsg = "Please enter some text";
  }else if(text.length > 140){
    errMsg = "Character limit exceeded";
  }

  let $newTweetError = $("#new-tweet-error");
  if(errMsg){
    $newTweetError.text(errMsg);
  }else{
    //clear textarea and error message
    $.ajax({
      url: "/tweets",
      data: $form.serialize(),
      method: "POST",
      success: function(){
        $newTweetError.text("");
        $textarea.val("");
        $textarea.siblings(".counter").text("140");
        loadTweets(0, 0);
      }
    })
  }
};

function displayNewTweetHandler(){
  let $newTweet = $(".new-tweet");
  $newTweet.slideToggle();
  $newTweet.find("textarea").focus();
};

$(document).ready(function(){
  loadTweets();
  $(".new-tweet").find("input").on("click", newTweetSubmitHandler);
  $("#display-new-tweet").on("click", displayNewTweetHandler);
});
