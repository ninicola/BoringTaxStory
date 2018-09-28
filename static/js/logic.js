//thousand delimited formatting function
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Adding map tile layers
//statelite, 
var satelliteMapLayer=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var grayscaleMapLayer=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var outdoorsMapLayer=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

 // Define a baseMaps object to hold our base layers
 var baseMapLayers = {
  "Satellite Map": satelliteMapLayer,
  "Grayscale Map":grayscaleMapLayer,
  "Outdoor Map": outdoorsMapLayer
};
var overlayLayers;
// Link to GeoJSON

// "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-" +
// "a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";
var geojsonOverlayLayer;
var plateOverlayLayer;
var legend;
var myMap;


var geojsonLink ='county_geo_json_v1.json'
//  'https://s3-us-west-2.amazonaws.com/usmapgeojson/us_states_geo.json';
var householdIncomeLink='/households';


// function createMap (geojsonLink,borderjsonLink)
// Grabbing data with d3... EarthquakeData and BorderJsonData at the same time
// read two jsons at the same time.
d3.queue()
  .defer(d3.json,geojsonLink)
  // .defer(d3.json,householdIncomeLink)
  .await(function(error,data){
    if (error) throw errors;
    // json(geojsonLink, function(data) {
  
  // var geojson;
  
//household income json (Not geojson)
  // plateOverlayLayer=L.geoJSON(borderjsonData,{
  //   onEachFeature: function(feature, layer) {
  //     L.polyline(feature.geometry.coordinates);
  //   },
  //   style:{
  //     weight:3,
  //     color:'orange'
  //   }
  // });


// Creating a new choropleth layer
geojsonOverlayLayer = L.choropleth(data, {
  // Which property in the features to use
  valueProperty: "median_income_2017",
  // Color scale
  scale: ["#ffffb2", "#036819"],
  // Number of breaks in step range
  steps: 10,
  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },
  // Binding a pop-up to each layer
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<br>State Name:"+ feature.properties.name + 
                    "<br> Median Household Income: $" + numberWithCommas(feature.properties.median_income_2017) );
  },
  pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.median_income_2017**2/2.5,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
  }
});//.addTo(myMap);



  // Creating map object
  myMap = L.map("map", {
    center: [38.8869223,-104.2744006],
    zoom: 3.5,
    layers:[satelliteMapLayer,geojsonOverlayLayer]
  });
  // Create overlay object to hold our overlay layer
  overlayLayers = {
    // Borderlines: plateOverlayLayer
    'Y 2017': geojsonOverlayLayer
  };


  L.control.layers(baseMapLayers, overlayLayers, {
  collapsed: false
  }).addTo(myMap);

    // Setting up the legend
    legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojsonOverlayLayer.options.limits;
      var colors = geojsonOverlayLayer.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo = "<h4>2017 Median Household Income by States</h4>" +
        "<div class=\"labels\">" +
          "<div class=\"min\"> $" + numberWithCommas(limits[0]) + "</div>" +
          "<div class=\"max\"> $" + numberWithCommas(limits[limits.length - 1]) + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };


  // Adding legend to the map
  legend.addTo(myMap);

});


  