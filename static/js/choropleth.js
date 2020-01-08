/////////////////////////////////////////////////
// Choropleth Map
/////////////////////////////////////////////////

// Render Choropleth Map
var mapboxAccessToken = API_KEY
var myGeoJSONPath = 'http://127.0.0.1:5000/static/json/countries.json'; //custom.geo.json
var myCustomStyle = {
    stroke: false,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
};

var json = GEO_JSON
// console.log(json)

// Link to country GeoJSON
var geoJSONLink = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

var map = L.map('map').setView([25.0, 5.0], 2);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
	id: 'mapbox.light',
	// attribution: ...
}).addTo(map);

// Add geojson data to map
// L.geoJson(json).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    // console.log(`info.update: ${props}`)
    this._div.innerHTML = '<h5>% Gold Medals Won per Year</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'Share of Gold Medals: ' + props.pct_gold + '%'
        : '<h6>Hover over a country<h6>');
};

info.addTo(map);


function getColor(d) {
    // console.log(`pct_gold: ${d}`)
    
    if      (d >= 30) {return '#ebc000';}
    else if (d >= 20) {return '#ffd700';}
    else if (d >= 15) {return '#ffe26b';}
    else if (d >= 10) {return '#ffeca3';}
    else if (d >= 5)  {return '#fff6d3';}
    else if (d >= 0)  {return '#ffffff';}

};

function style(feature) {
	return {
		fillColor: getColor(feature.properties.pct_gold),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
};

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson

slider = L.control.slider(function(value) {
    // console.log(value);

    if (value >= 1996 & value < 2012) {value = value -2} 
    else if (value >= 2012) {value = 2014}

    if (map.hasLayer(geojson)) {
        console.log("geojson exists")
        map.removeLayer(geojson);
    }

    geojson = L.geoJson(json, {
        filter: function(feature, layer) {
            return feature.properties.year == value;
        },
        style: style,
        onEachFeature: onEachFeature
    });

    geojson.addTo(map)
    // console.log(geojson)

}, {
    min: 1924,
    max: 2014,
    value: 1924,
    step: 4,
    size: '250px',
    orientation:'horizontal',
    position: 'bottomright',
    id: 'slider',
    collapsed: false,
    increment: true
}).addTo(map);

// console.log(slider.options.value);
// console.log(map);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20, 30],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
