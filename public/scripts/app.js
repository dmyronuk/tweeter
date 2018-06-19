/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
          <h2>${user.name}</h2>
          <h4>${user.handle}</h4>
        </header>
        <div>
          <section>${content.text}</section>
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
}

const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}

$(document).ready(function(){
  var $tweet = $(createTweetElement(tweetData));
  $('#prev-tweets').append($tweet);
})
