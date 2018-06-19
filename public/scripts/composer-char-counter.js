$(document).ready(function(){
  $(".new-tweet").find("textarea").on("input", function(event){
    let charsLeft = 140 - $(this).val().length;
    let counter = $(this).siblings(".counter");
    counter.text(charsLeft);
    if(charsLeft < 0){
      if(! counter.hasClass("over-char-limit")){
        counter.addClass("over-char-limit");
      }
    }else{
      if(counter.hasClass("over-char-limit")){
        counter.removeClass("over-char-limit");
      }
    }
  })
});
