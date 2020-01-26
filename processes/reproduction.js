// This file holds the functions/logic for reproduction and mating

// Handles logic for mating two parents
const mate = (father, mother) => {
    mother.gestating = true;
    mother.partner = father;
}

// Creates new organism through sexual reproduction
const reproduce = (father, mother) => {

    // Number of  offspring per birth is determined by genes
    for (let i = 0; i < mother.dna.genes.numOffspring; i++) {
        // Offspring's genes are determined by mother and father's
        const offspringGenes = Dna.crossover(father, mother, 0.1);

        // Create a new creature and set it's genes equal to those inherited above
        const offspring = new Creature(mother.pos.x, mother.pos.y);
        offspring.dna.genes = offspringGenes;

        // To punish the creatures for having offspring too quickly, we will
        // simulate 'underbred' creatures by lessening each trait
        let degreeDeveloped = Math.log(mother.dna.genes.gestationPeriod / 60);

        // The log function has a nice curve that makes it harshly affect very small things and not harshly
        // affect larger values
        // We use 1/60 because 600 (the default) / 60 = 10 and log(10) = 1

        if (degreeDeveloped > 1.05)
            degreeDeveloped = 1.05; // The genes shouldn't ever increase by more than this so we don't get super creatures
        else if (degreeDeveloped < 0.8)
            degreeDeveloped = 0.8; // The genes shouldn't ever decrease by more than this

        // Modify all will change each value in a range around our modifier
        offspring.dna.genes = Dna.modifyAll(offspring.dna.genes, degreeDeveloped, 0.05);

        // Makes sure offspring don't instantly mate with each other
        offspring.reproductionCooldown = 150;
    
        // Add it to our creatures array
        creatures.push(offspring);
    }
}

// Pass in two creatures and checks if the two are mateable
const checkMateable = (creature1, creature2) => {
    let mother, father;

    if (creature1.sex == "female") {
        mother = creature1;
        father = creature2;
    } else {
        father = creature1;
        mother = creature2;
    }

    // One requirement is that the female is not gestating
    const isGestating = mother.gestating;

    // Female's birth cooldown must be 0
    const isReady = mother.reproductionCooldown <= 0;

    // This is mostly so offspring don't immediately mate with each other
    const isOldEnough = mother.lifespan > 250 && father.lifespan > 250;

    return !isGestating && isReady && isOldEnough; // Add future requirements here with &&
}

// DEPRECATED: TEST PURPOSES ONLY
// Creates replica through asexual reproduction
const createBaby = (parent) => {
    const baby = new Creature(parent.pos.x, parent.pos.y, parent.color);
    baby.dna = parent.dna.replicate();

    creatures.push(baby);
}