$(document).ready(function(){
  var dropdown = $(".search-dropdown");
  var toogleBtn = $(".search-dropdown .dropdown-toggle");
  
  // Toggle search and close icon for search dropdown
  dropdown.on("show.bs.dropdown", function(e){
    toogleBtn.toggleClass("d-none");
  });
  dropdown.on("hide.bs.dropdown", function(e){
    toogleBtn.addClass("d-none");
    toogleBtn.first().removeClass("d-none");
  });
});