// Render Choropleth Map
var myGeoJSONPath = 'static/json/countries_geoJSON.json';
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
};

d3.json(myGeoJSONPath,function(data){
    var map = L.map('map').setView([39.74739, -105], 4);

    L.geoJson(data, {
        clickable: false,
        style: myCustomStyle
    }).addTo(map);
});