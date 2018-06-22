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
};

//takes a time int and return a string for display in html
function formatTimeElapsed(created_at){
  let curDate = new Date();
  let createdDate = new Date(created_at);

  let yearsElapsed = curDate.getFullYear() - createdDate.getFullYear();
  let monthsElapsed = curDate.getMonth() - createdDate.getMonth();
  let daysElapsed = curDate.getDay() - createdDate.getDay();
  let hoursElapsed = curDate.getHours() - createdDate.getHours();

  let testArr = [[yearsElapsed, "year"],[monthsElapsed, "month"],[daysElapsed, "day"]]
  let i = 0;
  let outElem;
  //if tweet happened a year ago return 1 year ago instead of x months ago, x days ago etc
  while(i < testArr.length && !outElem){
    if(testArr[i][0] > 0){
      outElem = testArr[i];
    }
    i++;
  }
  //if first array search turns up empty
  if(! outElem){
    let diffMinutes = (curDate.getTime() - createdDate.getTime()) / (1000 * 60);

    if(diffMinutes > 60){
      outElem = [Math.round(diffMinutes/60), "hour"];
    }else if(diffMinutes >= 1){
      outElem = [Math.round(diffMinutes), "minute"];
    }
  }

  //if we still don't have an outElem the tweet is less than a minute old
  if(! outElem){
    return "just now";
  }else{
    //add and s so minute becomes minutes
    let suffix = outElem[0] === 1 ? "" : "s";
    return `${outElem[0]} ${outElem[1]}${suffix} ago`;
  }
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
        loadTweets();
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
