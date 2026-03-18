
mapboxgl.accessToken = maptoken;

async function getCoordinates() {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${l}&limit=1&access_token=${maptoken}`;
  const response = await fetch(url);
  const data = await response.json();
  const coordinates = data.features[0].geometry.coordinates;
  return coordinates;
}
let coords = getCoordinates().then(coords => {
    const map = new mapboxgl.Map({
        container: 'map', 
        center: [coords[1], coords[0]],
        zoom: 9 
    });
});


