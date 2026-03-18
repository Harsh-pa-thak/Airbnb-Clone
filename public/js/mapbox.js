mapboxgl.accessToken = maptoken;

async function getCoordinates() {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${l}&limit=1&access_token=${maptoken}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.features[0].geometry.coordinates;
}

getCoordinates().then(coords => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: coords,   // already [lng, lat]
    zoom: 9
  });

  new mapboxgl.Marker()
    .setLngLat(coords)
    .addTo(map);
});