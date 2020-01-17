// This file holds the functions/logic for reproduction and mating

// Creates new organism through sexual reproduction
const mate = (father, mother) => {

    // Offspring's genes are determined by mother and father's
    const offspringGenes = Dna.crossover(father, mother, 0.15);

    // Create a new creature and set it's genes equal to those inherited above
    const offspring = new Creature(this.pos.x, this.pos.y);
    offspring.dna.genes = offspringGenes;
    
    // Add it to our creatures array
    creatures.push(offspring);
}

// DEPRECATED: TEST PURPOSES ONLY
// Creates replica through asexual reproduction
const createBaby = (parent) => {
    const baby = new Creature(parent.pos.x, parent.pos.y, parent.color);
    baby.dna = parent.dna.replicate();

    creatures.push(baby);
}