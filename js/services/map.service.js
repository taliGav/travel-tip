import { util } from './util.service.js';
import { locService } from './loc.service.js';
import { storageService } from './storage.service.js';

export const mapService = {
    initMap,
    addLocation,
    removeLoc,
    panTo,
    addMarker
};

const STORAGE_KEY = 'locsDB';

function initMap() {
    console.log('InitMap');
    return _connectGoogleApi();
}

function addLocation(pos) {
    locService.getLocs()
        .then((locs) => {
            console.log(locs);
            if (!locs) locs = [];
            pos.id = util.makeId(5);
            if (postMessage.name === '') return;
            locs.push(pos);
            // addMarker(pos);
            storageService.save(STORAGE_KEY, locs);
        });
}

function removeLoc(id) {
    gPlaces = gPlaces.filter(place => place.id !== id);
    removeMarker(id);
    saveToStorage(STORAGE_KEY, gPlaces);

}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyAOf-gO34FqfRnFoi5TwqmvHOoGLzw1qI0';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function geocoding() {
    const API_KEY = 'AIzaSyAOf-gO34FqfRnFoi5TwqmvHOoGLzw1qI0';
    `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`;
}

function removeMarker(id) {
    const idx = gMarkers.findIndex((marker) => {
        return marker.id === id;
    });
    const marker = gMarkers[idx];
    gMarkers.splice(idx, 1);
    console.log(idx, gMarkers);
    marker.setMap(null);
}


function _addCurrLocBtn(map) {
    const locationButton = document.createElement('button');
    locationButton.innerText = 'Pan to Current Location';
    locationButton.classList.add('custom-map-control-button');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener('click', () => {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            const { latitude, longitude } = coords;
            const pos = {
                lat: latitude,
                lng: longitude,
            };
            map.setCenter(pos);
        });
    });
};