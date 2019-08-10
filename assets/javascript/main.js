console.log("This app rocks");

var queryURL = "https://www.worldtides.info/api?extremes&lat=33.768321&lon=-118.195617&length=604800&key=3829b936-6058-47fd-89e8-5853c311d142";
$.ajax({
  url: queryURL,
  method: "GET"
})
  .then(function (response) {
    console.log(response.extremes);
  });
 




