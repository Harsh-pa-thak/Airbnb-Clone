
mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [80.2705, 13.0843],
    zoom: 9 
});

async function getCoordinates() {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${}&limit=1&access_token=${maptoken}`;
  const response = await fetch(url);
  const data = await response.json();
  const coordinates = data.features[0].geometry.coordinates;
  return coordinates;
}

getCoordinates().then(coords => console.log(coords));