
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [80.2705, 13.0843], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 
});