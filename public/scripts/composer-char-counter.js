$(document).ready(function(){
  $(".new-tweet").find("textarea").on("input", function(event){
    let charsLeft = 140 - $(this).val().length;
    let counter = $(this).siblings(".counter");
    counter.text(charsLeft);
    if(charsLeft < 0){
      counter.css("color", "red");
    }else{
      counter.css("color", "black")
    }
  })
});
