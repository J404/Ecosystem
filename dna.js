class Dna {
  constructor() {
    this.genes = {
      speed: 3, 
      mass: 20, 
      range: 75,
      gestationPeriod: 600,
      reproductiveUrge: 35,
      numOffspring: 2
    }
    this.numTraits = 3;
  }
  
  // Returns new genes from two parents through sexual reproduction using
  // the crossover method
  // This function is static so it can be accessed by reproduction.js
  static crossover(father, mother, mutationRate) {
    const offspringGenes = {};

    // It doesn't matter which parent's genes we cycle through because they should be the same
    for (let gene in father.dna.genes) {

      // For each gene, there is a 50% chance it comes from the mother or father
      if (random(1) < 0.5) {
        offspringGenes[gene] = father.dna.genes[gene];
      } else {
        offspringGenes[gene] = mother.dna.genes[gene];
      }

      // There is also a chance that the gene will mutate
      // genes can change by + or - 15% of the original
      if (random(1) < mutationRate) {
        offspringGenes[gene] += random(-0.15, 0.15) * offspringGenes[gene];
      }
    }

    return offspringGenes;
  }

  // Accepts a set of genes and an amount to modify them by, then returns a set of genes
  // that are modified by the amount
  // Genes can be modified by a amount +/- the range
  static modifyAll(genes, amount, range) {
    const newGenes = {};

    for (let gene in genes) {
      newGenes[gene] = genes[gene] * random(amount - range, amount + range);
    }

    return newGenes;
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

  // DEPRECATED
  // for asexual reproduction (cloning)
  replicate() {
    let newDNA = new Dna();
    newDNA.genes = this.genes;
    newDNA.mutate(0.05);
    return newDNA;
  }
}