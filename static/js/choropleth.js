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
console.log(json)

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
    this._div.innerHTML = '<h5>Gold Medals per Year</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'gold medals: ' + props.gold
        : '<h6>Hover over a country<h6>');
};

info.addTo(map);


function getColor(d) {
    // #ffd700,#ffe26b,#ffeca3,#fff6d3,#ffffff

    if (d >= 20) {
        return '#ffd700';
    } 
    else if (d >= 15) {
        return '#ffe26b';
    }
    else if (d >= 10) {
        return '#ffeca3';
    }
    else if (d >= 5) {
        return '#fff6d3';
    }
    else {
        return '#ffffff';
    }
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
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
}

// L.geoJson(json, {style: style}).addTo(map);

var geojson;

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

// function yearFilter(feature) {
//     if (feature.properties.year === )
// }

default_choro = L.geoJson(json, {
        filter: function(feature, layer) {
            return feature.properties.year == 2014;
        },
        style: style,
        onEachFeature: onEachFeature
    });

default_choro.addTo(map);



// slider = L.control.slider(function(value) {
//     console.log(value);
//     // if (default_choro) {
//     //     console.log("Default_choro exists")
//     //     map.removeLayer(default_choro);
//     // }
//     // // map.eachLayer(function (layer) {
//     // //     map.removeLayer(layer);
//     // // });
//     // // var year;
//     // var year = L.geoJson(json, {
//     //     filter: function(feature, layer) {
//     //         return feature.properties.year == value;
//     //     },
//     //     style: style,
//     //     onEachFeature: onEachFeature
//     // });
//     // // map.removeLayer(year)
//     // year.addTo(map)
//     // // geojson = L.geoJson(json, {
//     // //     style: style,
//     // //     onEachFeature: onEachFeature
//     // // }).addTo(map);
// }, {
//     min: 1896,
//     max: 2012,
//     value: 2012,
//     step: 4,
//     size: '250px',
//     orientation:'horizontal',
//     position: 'bottomright',
//     id: 'slider',
//     collapsed: false,
//     increment: true
// }).addTo(map);

// console.log(slider);

// geojson = L.geoJson(json, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);

// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
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



// var years = [
//     1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 1948,
//     1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992,
//     1996, 2000, 2004, 2008, 2012
// ];
 
// function filterBy(year) {
//     var filters = ['==', 'year', year];
//     map.setFilter('earthquake-circles', filters);
//     map.setFilter('earthquake-labels', filters);
    
//     // Set the label to the year
//     document.getElementById('year').textContent = years[year];
// }