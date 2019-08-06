     // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            console.log("works");
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

// ********************************************************************************************************************
      // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      //   infoWindow.setPosition(pos);
      //   infoWindow.setContent(browserHasGeolocation ?
      //                         'Error: The Geolocation service failed.' :
      //                         'Error: Your browser doesn\'t support geolocation.');
      //   infoWindow.open(map);
      // }
      // function initMap() {
      //   var map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: 4,
      //     center: {lat: -25.363882, lng: 131.044922 }
      //   });
      
      //   var bounds = {
      //     north: -25.363882,
      //     south: -31.203405,
      //     east: 131.044922,
      //     west: 125.244141
      //   };
      
      //   // Display the area between the location southWest and northEast.
      //   map.fitBounds(bounds);
      
      //   // Add 5 markers to map at random locations.
      //   // For each of these markers, give them a title with their index, and when
      //   // they are clicked they should open an infowindow with text from a secret
      //   // message.
      //   var secretMessages = ['This', 'is', 'the', 'secret', 'message'];
      //   var lngSpan = bounds.east - bounds.west;
      //   var latSpan = bounds.north - bounds.south;
      //   for (var i = 0; i < 15; ++i) {
      //     var marker = new google.maps.Marker({
      //       position: {
      //         lat: bounds.south + latSpan * Math.random(),
      //         lng: bounds.west + lngSpan * Math.random()
      //       },
      //       map: map
      //     });
      //     attachSecretMessage(marker, secretMessages[i]);
      //   }
      // }
      
      // // Attaches an info window to a marker with the provided message. When the
      // // marker is clicked, the info window will open with the secret message.
      // function attachSecretMessage(marker, secretMessage) {
      //   var infowindow = new google.maps.InfoWindow({
      //     content: secretMessage
      //   });
      
      //   marker.addListener('click', function() {
      //     infowindow.open(marker.get('map'), marker);
      //   });
      // }