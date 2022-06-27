mapboxgl.accessToken = 'pk.eyJ1IjoiamVmZnJleXNoZW5jYyIsImEiOiJjamE5MDI4YmowMmMzMndzNDdoZmZnYzF5In0.zV3f0WhqbHeyixwY--TyZg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/jeffreyshencc/cl4vs5szm001514pbs41iqwve', // style URL
    center: [-74, 40], // starting position [lng, lat]
    zoom: 6, // starting zoom
    minZoom: 3,
    pitch: 40,
    bearing: -10,
    projection: "mercator"
});

map.addControl(new mapboxgl.FullscreenControl());

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true
});
map.addControl(nav, 'bottom-right');

function addCommas(n) {
    var parts = n.toString().split(".");
    const numberPart = parts[0];
    const decimalPart = parts[1];
    const thousands = /\B(?=(\d{3})+(?!\d))/g;
    return numberPart.replace(thousands, ",") + (decimalPart ? "." + decimalPart : "");
}

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
  closeButton: false,
  offset: [0, -15]
});

function generatePopup(event){
  const features = map.queryRenderedFeatures(event.point, {
    layers: ['3D-extrusions']
  });
  if (!features.length) {
    popup.remove();
    return;
  }
  const feature = features[0];
  feature.properties["color"] = "#ff00ff";

  // Code from the next step will go here.
  popup.setLngLat(event.lngLat)
  .setHTML(
    `<span class = "heading">Block Group ${feature.properties.GEOID}</span>
    <h3 style = "margin-top: 0px; margin-bottom: 5px;">${feature.properties.urban_area.split("--")[0]} Urban Area</h3>
    <p style = "margin-top:5px;margin-bottom:5px">${addCommas(feature.properties.vacant_units)} vacant units / ${addCommas(feature.properties.total_unit)} total<br> (${feature.properties.percent_vacant.toFixed(2)}% empty)</p>`
  )
  .addTo(map);
}

map.on('click', generatePopup);
map.on('movestart', () => {
  document.getElementById("overlay").innerHTML = "Calculating vacant units..."
  popup.remove();
});

// Get rendered features
function generateEmptyUnitsNumber(){
  const features = map.queryRenderedFeatures({ layers: ['3D-extrusions'] });
  let vacant = 0;

  if (features) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const id = feature.properties.GEOID;
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        vacant += feature.properties.vacant_units;
      }
    }
  }

  const formatter = Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 2
  });

  document.getElementById("overlay").innerHTML = `
    ${formatter.format(vacant)} vacant units on screen
  `
}

map.on('load', generateEmptyUnitsNumber);
map.on('moveend', generateEmptyUnitsNumber);

function returnToTop(){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
