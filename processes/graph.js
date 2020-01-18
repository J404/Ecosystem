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
        graph[gene] = [exDna.genes[gene]];
    }
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

}