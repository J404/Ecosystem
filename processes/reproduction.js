// This file holds the functions/logic for reproduction and mating

// Handles logic for mating two parents
const mate = (father, mother) => {
    mother.gestating = true;
}

// Creates new organism through sexual reproduction
const reproduce = (father, mother) => {

    // Offspring's genes are determined by mother and father's
    const offspringGenes = Dna.crossover(father, mother, 0.15);

    // Create a new creature and set it's genes equal to those inherited above
    const offspring = new Creature(mother.pos.x, mother.pos.y);
    offspring.dna.genes = offspringGenes;
    
    // Add it to our creatures array
    creatures.push(offspring);
}

// Pass in two creatures and checks if the two are mateable
const checkMateable = (father, mother) => {

    // One requirement is that the female is not gestating
    const isGestating = mother.gestating;

    // The two partners must be in range of each other
    const dist = p5.Vector.sub(father.pos, mother.pos);
    const inRange = dist.mag() < father.mass / 2;

    return !isGestating && inRange; // Add future requirements here with &&
}

// DEPRECATED: TEST PURPOSES ONLY
// Creates replica through asexual reproduction
const createBaby = (parent) => {
    const baby = new Creature(parent.pos.x, parent.pos.y, parent.color);
    baby.dna = parent.dna.replicate();

    creatures.push(baby);
}