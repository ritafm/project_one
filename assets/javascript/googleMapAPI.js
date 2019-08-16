/// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

$(document).ready(function () {
    $('.modal').modal();
});

$(document).ready(function () {
    $('.tabs').tabs();
});


var queryURL = "";
var lat = 0;
var lng = 0;
var Tides = {};
var promise;
var day;
var markers;
var map;
var place;
var click;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 6
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {


            var marker = new google.maps.Marker({
                position: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
                map: map,
            });
            var srcWeather = 'https://www.theweather.com/wid_loader/' + place.place_id;


            var infowindow = new google.maps.InfoWindow({
                // content: '<h1> lat: ' + place.geometry.location.lat() + 'lng: ' + place.geometry.location.lng() + '</h1>',
                // zoom: 12

            });

            lat = place.geometry.location.lat();
            lng = place.geometry.location.lng();

            queryURL = "https://www.worldtides.info/api?extremes&lat=" + lat + "&lon=" + lng + "&length=604800&key=3829b936-6058-47fd-89e8-5853c311d142";

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response);

                    var days = {};
                    var day;

                    for (let i = 0; i < response.extremes.length; i++) {
                        delete response.extremes[i].date;

                        day = moment.unix(response.extremes[i].dt).format('MMM Do');
                        if (days[day] === undefined) {
                            days[day] = [];
                        }

                        response.extremes[i].dt = moment.unix(response.extremes[i].dt).format('MMM Do hh:mm a');
                        days[day].push(response.extremes[i]);
                    }

                    console.log(days);

                    var dayNum = 0;
                    for (var key in days) {
                        var day_rows = days[key];

                        // populate the tab element for this day
                        var tab = document.createElement("li");
                        tab.classList.add("tab", "col", "s3");

                        var tab_text = document.createElement("a");
                        tab_text.setAttribute("href", "#modal-tab-" + String(dayNum));
                        tab_text.innerText = key;

                        tab.appendChild(tab_text);
                        document.getElementById("modalTabsInner").appendChild(tab);

                        // get the column names for the table
                        var col = [];
                        for (var i = 0; i < day_rows.length; i++) {
                            for (var colName in day_rows[i]) {
                                if (col.indexOf(colName) === -1) {
                                    col.push(colName);
                                }
                            }
                        }

                        console.log("col", col);
                        console.log("day_rows", day_rows);

                        // fill out the actual table for this day
                        var tableContainer = document.createElement("div");
                        tableContainer.classList.add("col", "s12");
                        tableContainer.setAttribute("id", "modal-tab-" + String(dayNum));

                        // CREATE DYNAMIC TABLE.
                        var table = document.createElement("table");
                        table.classList.add("striped");

                        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                        var tr = table.insertRow(-1);                   // TABLE ROW.

                        for (var i = 0; i < col.length; i++) {
                            var th = document.createElement("th");      // TABLE HEADER.
                            th.innerHTML = col[i];
                            tr.appendChild(th);
                        }

                        // ADD JSON DATA TO THE TABLE AS ROWS.
                        for (var i = 0; i < day_rows.length; i++) {
                            tr = table.insertRow(-1);

                            for (var j = 0; j < col.length; j++) {
                                var tabCell = tr.insertCell(-1);
                                console.log(day_rows, i, j, col[j]);
                                tabCell.innerHTML = day_rows[i][col[j]];
                            }
                        }

                        // put everything in its right place
                        tableContainer.appendChild(table);
                        document.getElementById("modalTabsOuter").appendChild(tableContainer);

                        // increment our counter so we get unique IDs for each day
                        dayNum += 1;
                    }
\

                });


            // On click of marker display infoWindow
            marker.addListener("click", function () {
                infowindow.open(map, marker);

                console.log(place);
                lat = place.geometry.location.lat();
                lng = place.geometry.location.lng();
                queryURL = "https://www.worldtides.info/api?extremes&lat=" + lat + "&lon=" + lng + "&length=604800&key=3829b936-6058-47fd-89e8-5853c311d142";



                // // make if box is filled use that else use the clicked location
                //  lat = place.geometry.location.lat();
                // // console.log("lat:",place.geometry.location.lat());
                // // gets the lng
                //  lng = place.geometry.location.lng();
                // // console.log("lng:",place.geometry.location.lng());

                // console.groupEnd();
                var name = place.formatted_address;



                $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                    .then(function (response) {
                        console.log(response);

                        console.log("i guess we get here after all");



                        // CREATE DYNAMIC TABLE.
                        var table = document.createElement("table");

                        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

                        var tr = table.insertRow(-1);                   // TABLE ROW.

                        for (var i = 0; i < col.length; i++) {
                            var th = document.createElement("th");      // TABLE HEADER.
                            th.innerHTML = col[i];
                            tr.appendChild(th);
                        }

                        // ADD JSON DATA TO THE TABLE AS ROWS.
                        for (var i = 0; i < Tides.length; i++) {

                            tr = table.insertRow(-1);

                            for (var j = 0; j < col.length; j++) {
                                var tabCell = tr.insertCell(-1);
                                tabCell.innerHTML = Tides[i][col[j]];


                            }
                        }

                        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                        var divContainer = document.getElementById("showData");
                        divContainer.innerHTML = "";
                        divContainer.appendChild(table);

                    }

                    )
            });
        });
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
        };


        // // Create a marker for each place.
        // markers.push(new google.maps.Marker({
        //   map: map,
        //   icon: icon,
        //   title: place.name,
        //   position: place.geometry.location, 
        //   zoom: 6
        // }));

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

}