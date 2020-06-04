
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
  // Setting index number for creatingMetaData() and createPlot()
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

      // Calling creatingMetaData()
      creatingMetaData (indexNumber)
      // console.log("creatingMetaData() in optionChanged() indexNumber = " + indexNumber)
    
      // Calling createPlot()
      createPlot (indexNumber)
      // console.log("createPlot() in optionChanged() indexNumber = " + indexNumber)
    });
  }
  var dropDownoption = filterOption.node().value
  setIndexNum(Number(dropDownoption))
}

function creatingMetaData (indexNumber) {
  // Select the div element and get the raw HTML node
  var populateDemo = d3.select('#sample-metadata');

  // First, clear out any existing data
  populateDemo.html("");

  // Add each key and value pair for demographic information and add new paragraph tags
  d3.json("data/samples.json").then((importedData) => {
    Object.entries(importedData.metadata[indexNumber]).forEach(([key,value]) => populateDemo.append('p').text(key.toUpperCase() + ": " + value));
      // console.log("creatingMetaData() indexNumber = " + indexNumber)
  });
}

function createPlot (indexNumber) {
    d3.json("data/samples.json").then((importedData) => {
      // Use the map method with the arrow function to return all out_ids and their top 10 values
      var newIds = importedData.samples.map(data=>(data.otu_ids).slice(0,10))
      var newIdsBubble = importedData.samples.map(data=>(data.otu_ids))

      // Use the map method with the arrow function to return all sample_values and their top 10 values
      var newLabels = importedData.samples.map(data=>(data.otu_labels).slice(0,10))
      var newLabelsBubble = importedData.samples.map(data=>(data.otu_labels))

      // Use the map method with the arrow function to return all sample_values and their top 10 values
      var newValues = importedData.samples.map(data=>(data.sample_values).slice(0,10))
      var newValuesBubble = importedData.samples.map(data=>(data.sample_values))

      // Getting the washing frequency
      var metaDataWfreq= (importedData.metadata)[indexNumber]['wfreq']


      function barChart() {
        var barChart = {
          x: newValues[indexNumber],
          y: newIds[indexNumber],
          text: newLabels[indexNumber],
          type: "bar",
          orientation: "h",
          marker: {
            color: newIds[indexNumber]}
        };

        var layout = {
          height: 550,
          width: 350,
          title:'<b>Top Ten Microbial Diversity</b>',
          yaxis: {
            title: "OTUs",
            tickformat:"0f",
            showgrid:true,
            tickvals: newIds[indexNumber],
            type: "category",
            autorange:'reversed'},
          xaxis: {
            title: "Values"}
        };

        Plotly.newPlot("bar", [barChart], layout);
      }
      
      function bubbleChart() {
        var bubbleChart = {
          x: newIdsBubble[indexNumber],
          y: newValuesBubble[indexNumber],
          text: newLabelsBubble[indexNumber],
          mode: 'markers',
          marker: {
            color: newIdsBubble[indexNumber],
            size: newValuesBubble[indexNumber]
          }
        };
        
        var layout = {
          title: '<b>Relative Abundance of Microbial "Species"</b>',
          showlegend: false,
          width: 900,
          yaxis: {
            title: "Values",
            tickformat:"0f",
            showgrid:true,
            range:["min", "max"]
          },
          xaxis: {
            title: "OTU ID"}
        };
        Plotly.newPlot('bubble', [bubbleChart], layout);
      }
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
      
      barChart();
      bubbleChart()
      gaugechart()
    }); 
}

function init() {
      // Setting index to 0
      indexNumber = 0

      // Calling creatingMetaData()
      creatingMetaData (indexNumber)
      // console.log("creatingMetaData() in init() indexNumber = " + indexNumber)
    
      // Calling createPlot()
      createPlot (indexNumber)
      // console.log("createPlot() in init() indexNumber = " + indexNumber)
}
init()