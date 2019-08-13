// This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

      var queryURL = "";
      var lat = 0;
      var lng = 0;
      var Tides = {};
      var promise;
      var day;
      function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
          


          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {

            // console.log("Map Object Name: " + place.formatted_address);
            // console.groupCollapsed("Object");
            // console.log(place);
            // console.groupEnd();
            // console.groupCollapsed("Lat & Lng");
            // gets the lat

             lat = place.geometry.location.lat();
            // console.log("lat:",place.geometry.location.lat());
            // gets the lng
             lng = place.geometry.location.lng();
            // console.log("lng:",place.geometry.location.lng());

            // console.groupEnd();
            var name = place.formatted_address;

            queryURL = "https://www.worldtides.info/api?extremes&lat=" + lat + "&lon=" + lng + "&length=604800&key=3829b936-6058-47fd-89e8-5853c311d142";
           
            $.ajax({
            url: queryURL,
            method: "GET"
            })
            .then(function (response) {

               

            //    console.groupCollapsed("Tides Location Name");
            //    console.log(name);
            //    console.groupEnd();
            //    console.groupCollapsed("Location Tide Info");
            //    console.log(response.extremes);
            //    console.groupEnd();
          
            for(let i = 0 ; i < response.extremes.length; i++){
                delete response.extremes[i].date;
                console.log(Reflect.set(Tides, i, moment.unix().format('MMMM Do YYYY hh:mm a')));
                // console.log(moment.unix(response.extremes[i].dt).format('MMMM Do YYYY hh:mm a'));
                 
                
            }
            
           
            // console.log("SHOW"+JSON.stringify(place));
            Tides = response.extremes;
           
    
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
          
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location, 
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);   
            }
         
          map.fitBounds(bounds);
        });
    });
    }

    function CreateTableFromJSON() { 
     
        // console.log("Dito"+ JSON.stringify(Tides));
     // EXTRACT VALUE FOR HTML HEADER. 
     // ('Book ID', 'Book Name', 'Category' and 'Price')
     var col = [];
     
     for (var i = 0; i < Tides.length; i++) {
         for (var key in Tides[i]) {
             if (col.indexOf(key) === -1) {
                 col.push(key);
                 
                //  console.log(day);
                
                 
             }
         }
     }

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
