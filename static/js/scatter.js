var url = "/gdp_medals";

d3.json(url).then(function(olympicData) {

  var golds = [];
  var silvers = [];
  var bronzes = [];

  for (var i = 0; i < olympicData.length; i++) {
    var d = olympicData[i];

    var goldDict = {};
    goldDict['x'] = d.year;
    goldDict['y'] = d.gold;
    goldDict['r'] = d.gdp/4000;
    golds.push(goldDict);

    var silverDict = {};
    goldDict['x'] = d.year;
    goldDict['y'] = d.silver;
    goldDict['r'] = d.gdp/4000;
    silvers.push(silverDict);

    var bronzeDict = {};
    goldDict['x'] = d.year;
    goldDict['y'] = d.bronze;
    goldDict['r'] = d.gdp/4000;
    bronzes.push(bronzeDict);
  }


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
          data: golds
        }, {
          label: ["Silver"],
          backgroundColor: "rgba(74,74,74,0.4)",
          borderColor: "rgba(74,74,74,1)",
          data: silvers
          // data: [{
          //   x: [years],
          //   y: [silvers],
          //   r: [gdps]
          // }]
        }, {
          label: ["Bronze"],
          backgroundColor: "rgba(128,74,0,0.4)",
          borderColor: "rgba(128,74,0,1)",
          data: bronzes
          // data: [{
          //   x: [years],
          //   y: [bronzes],
          //   r: [gdps]
          // }]
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
    

}); //d3.json end