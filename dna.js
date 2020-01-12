class Dna {
  constructor() {
    this.genes = [3, 20, 50];
    // speed, mass, range
  }
  
  // for asexual reproduction (cloning)
  replicate() {
    let newDNA = new Dna();
    newDNA.genes = this.genes;
    newDNA.mutate(0.05);
    return newDNA;
  }
  
  // for genetic variation in sexual reproduction
  // selects which parents gives which genes then mutates each (possibly)
  crossover(partnerDNA, mutationRate) {
    let offspringGenes = [];
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.5) {
        offspringGenes[i] = this.genes[i];
      } else {
        offspringGenes[i] = partnerDNA.genes[i];
      }
      if (random(1) < mutationRate) {
        offspringGenes[i] += random(-0.5, 1);
      }
    }
    
    return offspringGenes;
  }
  
  // method for directly mutating genes
  mutate(mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) <= mutationRate) {
        let change = random(-0.15, 0.15);
        this.genes[i] += (abs(change * this.genes[i] < 5)) ? change * this.genes[i] : 5;
      }
    }
  }
}