class Dna {
  constructor() {
    this.genes = {
      speed: 3, 
      mass: 20, 
      range: 50
    }
    this.numTraits = 3;
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
    let offspringGenes = this.genes;
    for (let gene in this.genes) {
      if (random(1) < 0.5) {
        offspringGenes[gene] = this.genes[gene];
      } else {
        offspringGenes[gene] = partnerDNA.genes[gene];
      }
      if (random(1) < mutationRate) {
        offspringGenes[gene] += random(-0.5, 0.5);
      }
    }
    
    return offspringGenes;
  }
  
  // method for directly mutating genes
  mutate(mutationRate) {
    for (let gene in this.genes) {
      if (random(1) <= mutationRate) {
        let change = random(-0.15, 0.15);
        this.genes[gene] += (abs(change * this.genes[gene] < 5)) ? change * this.genes[gene] : 5;
      }
    }
  }
}