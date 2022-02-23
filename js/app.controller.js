'use strict';

import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

var gMap;


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onRemoveLoc = onRemoveLoc;
window.onSearchPlace = onSearchPlace;

function onInit() {
    mapService.initMap()
        .then((res) => {
            console.log(res);
            console.log('Map is ready');
        })

        .then(() => {
            console.log('google available');
            const myLatlng = { lat: 32.0749831, lng: 34.9120554 };
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: myLatlng,
                zoom: 10
            });
            console.log('Map!', gMap);
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: myLatlng,
            });

            infoWindow.open(gMap);

            gMap.addListener('click', ({ latLng }) => {
                const name = prompt('Give name');
                const pos = {
                    name,
                    coords: {
                        lat: latLng.lat(),
                        lng: latLng.lng()
                    }
                };
                onAddLocation(pos);

                //     renderPlaces();
                //     gMap.setCenter(pos.coords);
                // });

                // _addCurrLocBtn(gMap);

                gMap.addListener("click", (mapsMouseEvent) => {
                    console.log('mapsMouseEvent', mapsMouseEvent);
                    infoWindow.close();
                    infoWindow = new google.maps.InfoWindow({
                        position: mapsMouseEvent.latLng,
                    });
                    infoWindow.setContent(
                        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                    );
                    infoWindow.open(gMap);
                });
            });
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onSearchPlace() {
    var place = document.querySelector('.search-input').value; 
    console.log('place',place);
    const request = {
        query: place,
        fields: ["name", "geometry"],
    };

    var service = new google.maps.places.PlacesService(gMap);
    service.findPlaceFromQuery(request, (results, status) => {
        console.log('status',status);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }

            gMap.setCenter(results[0].geometry.location);
        }
    });
}

function createMarker(place) {
    console.log('place.name',place.name);
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        gMap,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(gMap);
    });
}


function onAddLocation(pos) {
    mapService.addLocation(pos);
}


function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs);
            document.querySelector('.locs').innerText = JSON.stringify(locs);
        });
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch(err => {
            console.log('err!!!', err);
        });
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onRemoveLoc(id) {
    mapService.removeLoc(id);
    renderPlaces();
}