//thousand delimited formatting function
const numberWithCommas_2 = (x) => {
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
 var baseMapLayers_county = {
  "Satellite Map": satelliteMapLayer,
  "Grayscale Map":grayscaleMapLayer,
  "Outdoor Map": outdoorsMapLayer
};
var overlayLayers;
// Link to GeoJSON

// "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-" +
// "a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";
var geojsonOverlayLayer_county;
var plateOverlayLayer_county;
var legend_county;
var myMap_county;


var geojsonLink_by_county= 'csv/county_geo_json_v1.json'
// 'https://s3-us-west-2.amazonaws.com/usmapgeojson/county_geo_json_v1.json'
// 'csv/county_geo_json_v1.json'

// function createMap (geojsonLink,borderjsonLink)
// Grabbing data with d3... EarthquakeData and BorderJsonData at the same time
// read two jsons at the same time.
d3.queue()
  .defer(d3.json,geojsonLink_by_county)
  .await(function(error,data){
    if (error) throw error;
    // json(geojsonLink, function(data) {
  
  // var geojson;
  console.log('here is the county geo data:', data)


// Creating a new choropleth layer
geojsonOverlayLayer_2015 = L.choropleth(data, {
  // Which property in the features to use
  valueProperty: "Income",
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
    layer.bindPopup("<br>County Name:"+ feature.properties.NAME + ' '+ feature.properties.LSAD +
                    "<br> Median Income: $" + (feature.properties.Income) +
                    "<br> Income Per Capita: $" + (feature.properties.IncomePerCap) +
                    "<br> Men/Women Ratio: " + (feature.properties.Men/feature.properties.Women));
  }
  // pointToLayer: function (feature, latlng) {
  //       return L.circleMarker(latlng, {
  //         radius: feature.properties.Income**3/1,
  //         weight: 1,
  //         opacity: 1,
  //         fillOpacity: 0.8
  //       });
  // }
});

  // Creating map object for the state chrotemap
  myMap_county = L.map("map_county", {
    center: [38.8869223,-104.2744006],
    zoom: 3.5,
    layers:[satelliteMapLayer,geojsonOverlayLayer_2015]
  });
  // Create overlay object to hold our overlay layer
  overlayLayers = {
    // Borderlines: plateOverlayLayer
    'Median Income': geojsonOverlayLayer_2015
  };


  L.control.layers(baseMapLayers, overlayLayers, {
  collapsed: false
  }).addTo(myMap_county);

    // Setting up the legend
    legend_county = L.control({ position: "bottomright" });
    legend_county.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = geojsonOverlayLayer_2015.options.limits;
      var colors = geojsonOverlayLayer_2015.options.colors;
      var labels = [];
  
      // Add min & max
      var legendInfo_county = "<h4>2015 American Median Income by Counties</h4>" +
        "<div class=\"labels\">" +
          "<div class=\"min\"> $" + numberWithCommas(limits[0]) + "</div>" +
          "<div class=\"max\"> $" + numberWithCommas(limits[limits.length - 1]) + "</div>" +
        "</div>";
  
      div.innerHTML = legendInfo_county;
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };


  // Adding legend to the map
  legend_county.addTo(myMap_county);

});


  