// This file will handle logic for creating/displaying the graphs
// of creature data over time

const graph = {}

// Add attributes to our graph for each gene
const initGraph = () => {
    const exDna = new Dna();

    // This method allows us to add any traits without needing to re-edit this logic
    for (let gene in exDna.genes) {

        // Initialize an attribute for each gene as an array
        // each attribute will be an array so we can store many values in it over time
        // the first data point will be the default dna values
        graph[gene] = [ exDna.genes[gene] ];
    }

    // Default the number of offspring to the starting amount
    graph.num = [ startingNumCreatures ];
}

// Accepts new data in the form of an object with each gene/trait and its corresponding
// value and adds that data to the graph
const addData = (data) => {
    for (let gene in data) {
        graph[gene].push(data[gene]);
    }
}

// Accepts an array of data (for a trait) and returns the average
const average = (data) => {
    let total = 0;

    for (let i = 0; i < data.length; i++) {
        total += data[i];
    }

    return total / data.length;
}

let test = [4, 5, 6];

const drawGraph = (gene, x, y, w, h) => {
    fill(255);
    rect(x, y, w, h);

    // To find the offset between each data point, we divide the total length by the number of data points
    const xOffset = w / graph[gene].length;
    const maxY = Math.max(...graph[gene]);
    const yScale = h / maxY;

    fill(0);
    textSize(20);
    strokeWeight(1);
    text(maxY.toFixed(3), x + 20, y + 20);
    text(gene, x + 20, y + h - 20);

    let prevX = 0;
    let prevY = graph[gene][0];

    for (let i = 1; i < graph[gene].length; i++) {
        const pointX = prevX + xOffset;
        const pointY = graph[gene][i];

        stroke(0);
        strokeWeight(2);
        line(x + prevX, (y + h) - prevY * yScale, x + pointX, (y + h) - pointY * yScale);

        prevX = pointX;
        prevY = pointY;
    }

    // At this point, prevY should be the last point drawn
    // This will display what y value the last point was at
    strokeWeight(1);
    text(prevY.toFixed(3), x + 20,  (y + h) - prevY * yScale)
}