
// Grab a reference to the dropdown select element
var filterOption = d3.select('#selDataset');

// Setting variable for optionChanged() metaDataIndex
var metaDataIndex;

// Populate dropdown options with the participant id names
d3.json("data/samples.json").then((importedData) => {
  var newNames = importedData.names
    // console.log(newNames)
    newNames.forEach(option => filterOption.append('option').attr('value', option).text(option));
}); 

function optionChanged() {
  // Setting index number for creatingMetaData() and createPlot2()
  function setIndexNum(value) {
    d3.json("data/samples.json").then((importedData) => {
      for(var i = 0; i < importedData.metadata.length; i++) {
          if((importedData.metadata)[i]['id'] === value) {
              // console.log("i for setIndexNum() = " + i)
              metaDataIndex = i;
          }
      }
      // Setting metaDataIndex as indexNumber
      indexNumber = metaDataIndex

      // Calling createPlot2()
      createPlot2 (indexNumber)
      // console.log("createPlot2() in optionChanged() indexNumber = " + indexNumber)
    });
  }
  var dropDownoption = filterOption.node().value
  setIndexNum(Number(dropDownoption))  
}

function createPlot2 (indexNumber) {
  d3.json("data/samples.json").then((importedData) => {
    var metaDataWfreq= (importedData.metadata)[indexNumber]['wfreq']

    function gaugechart() {
      // Gauge level
      var level = metaDataWfreq;

      // Trig to calc meter point
      var degrees = 9 - level,
          radius = 0.5;
      var radians = degrees * Math.PI / 9;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
      // Triangle path
      var mainPath = path1,
          pathX = String(x),
          space = ' ',
          pathY = String(y),
          pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);

      var data = [{ type: 'scatter',
        x: [0], y:[0],
          marker: {size: 14, color:'850000'},
          showlegend: false,
          name: 'scrubs',
          text: level,
          hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {
          colors:['rgba(14, 127, 0, .5)', 'rgba(50, 113, 11, .5)', 'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                  'rgba(210, 206, 145, .5)', 'rgba(220, 210, 175, .5)', 'rgba(232, 226, 202, .5)', 'rgba(244, 255, 225, .5)', 'rgba(255, 255, 255, .5)']
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        height: 550,
        width: 340,
        title: '<b>Washing Frequency</b><br>Scrubs per Week', 
        xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
      };
        Plotly.newPlot('gauge', data, layout);
    }
    gaugechart()
  }); 
}

function init2() {
  // Setting index to 0
  indexNumber = 0

  // Calling createPlot2 ()
  createPlot2 (indexNumber)
  // console.log("createPlot2 () in init2 () indexNumber = " + indexNumber)
}
init2()