// Render Choropleth Map
var myGeoJSONPath = 'static/json/countries_geoJSON.json'; //custom.geo.json
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
};

d3.json(myGeoJSONPath,function(data){
    var map = L.map('map').setView([25.0, 5.0], 2);

    L.geoJson(data, {
        clickable: false,
        style: myCustomStyle
    }).addTo(map);
});