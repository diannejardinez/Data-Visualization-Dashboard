
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
          height: 500,
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
      barChart();
      bubbleChart()
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