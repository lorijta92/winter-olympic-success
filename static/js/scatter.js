var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {

    var years = [];
    var golds = [];
    var silvers = [];
    var bronzes = [];
    var gdps = [];

    for (var i = 0; i < olympicData.length; i++) {
        years.push(olympicData[i].year);
        golds.push(olympicData[i].gold);
        silvers.push(olympicData[i].silver);
        bronzes.push(olympicData[i].bronze);
        gdps.push(olympicData[i].gdp/100);
    }

    // Filter for unique years
    // function onlyUnique(value, index, self) { 
    //     return self.indexOf(value) === index;}

    // var uniqueYears = years.filter(onlyUnique);

    // Generate chart
    new Chart(document.getElementById("bubble"), {
        type: 'bubble',
        data: {
          labels: "Medals",
          datasets: [
            {
              label: ["Gold"],
              backgroundColor: "rgba(255,221,50,0.4)",
              borderColor: "rgba(255,221,50,1)",
              data: [{
                x: years[0],
                y: golds[0],
                r: gdps[0]
              }]
            }, {
              label: ["Silver"],
              backgroundColor: "rgba(74,74,74,0.4)",
              borderColor: "rgba(74,74,74,1)",
              data: [{
                x: years[0],
                y: silvers[0],
                r: gdps[0]
              }]
            }, {
              label: ["Bronze"],
              backgroundColor: "rgba(128,74,0,0.4)",
              borderColor: "rgba(128,74,0,1)",
              data: [{
                x: years[0],
                y: bronzes[0],
                r: gdps[0]
              }]
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Relationship Between GDP and Medals Won'
          }, scales: {
            yAxes: [{ 
              scaleLabel: {
                display: true,
                labelString: "Count of Medals"
              }
            }],
            xAxes: [{ 
              scaleLabel: {
                display: true,
                labelString: "GDP (per capita)"
              }
            }]
          }
        }
    });

});