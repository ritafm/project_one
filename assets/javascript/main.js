console.log("This app rocks");




var queryURL = "https://www.worldtides.info/api?extremes&lat=33.768321&lon=-118.195617&key=3829b936-6058-47fd-89e8-5853c311d142";
$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        console.log(response.extremes);
        hiLow(response.extremes);
    });



  

function hiLow(data) {

    var body = document.getElementsByTagName("body")[0];
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    for (let i = 0; i < data.length; i++) {
        var row = document.createElement("tr");

        for (let j = 0; j < data.length; j++) {
            var cell = document.createElement("td");
            var cellText = document.createTextNode("cell in row " + i + ", column" + j);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
    tbl.setAttribute("border", "2");

    }
    console.log(hiLow);

    // hiLow();