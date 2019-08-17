/// This example adds a search box to a map, using the Google Place Autocomplete

$(document).ready(function () {
    $('.modal').modal();
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
        center: { lat: 48.4897, lng: -122.6756 },
        zoom: 9
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
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
                content: '<h5>' + place.name + '</h5>',

            });

            lat = place.geometry.location.lat();
            lng = place.geometry.location.lng();

            queryURL = "https://www.worldtides.info/api?extremes&lat=" + lat + "&lon=" + lng + "&length=604800&key=3829b936-6058-47fd-89e8-5853c311d142";

            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {

                    document.getElementById("modalTabsOuter").innerHTML = '<div class="col s12"><ul id="modalTabsInner" class="tabs"></ul></div>';

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

                    var dayNum = 0;
                    for (var key in days) {
                        var day_rows = days[key];

                        // populate the tab element for this day
                        var tab = document.createElement("li");
                        //tab.classList.add("tab", "col", "s3");
                        tab.classList.add("tab", "col");

                        var tab_text = document.createElement("a");
                        tab_text.setAttribute("href", "#modal-tab-" + String(dayNum));
                        tab_text.innerText = key;

                        tab.appendChild(tab_text);
                        document.getElementById("modalTabsInner").appendChild(tab);

                        // get the column names for the table
                        var col = ["Date", "Tide Height (ft)", "Type"];
                        var col2 = ["dt", "height", "type"];

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

                            for (var j = 0; j < col2.length; j++) {
                                var tabCell = tr.insertCell(-1);
                                tabCell.innerHTML = day_rows[i][col2[j]];
                            }
                        }

                        // put everything in its right place
                        tableContainer.appendChild(table);
                        document.getElementById("modalTabsOuter").appendChild(tableContainer);

                        // increment our counter so we get unique IDs for each day
                        dayNum += 1;
                    }
                    $('.tabs').tabs();
                }
                );

            if (!place.geometry) {
                return;
            }
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            map.fitBounds(bounds);
        });


    });

};
