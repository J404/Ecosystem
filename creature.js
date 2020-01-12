class Creature {
  constructor(x, y) {
    this.energy = 25000;

    // position values
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    // dna values / values from dna
    this.dna = new Dna();
    this.speedLimit = this.dna.genes[0];
    this.mass = this.dna.genes[1];
    this.range = this.dna.genes[2];

    this.targetFood = null;
    this.trackingCreature = false;

    this.reproductionClock = 0;
  }

  // use a function to determine how much energy each step costs the creature
  energyPerStep() {
    let energyCost = 0.75 * this.mass * this.vel.mag() * this.vel.mag();
    let lifeCost = 25;
    return energyCost + lifeCost;
  }

  move() {
    // reset values
    this.speedLimit = this.dna.genes[0];
    this.mass = this.dna.genes[1];
    this.range = this.dna.genes[2];

    this.reproductionClock++;

    // each step costs creature some energy, relating to function above
    this.energy -= this.energyPerStep();
    if (this.energy <= 0) {
      creatures.splice(creatures.indexOf(this), 1);
    }

    let acc = 0;

   // if there is no food sighted, move randomly
    if (this.targetFood == null) {
      acc = p5.Vector.random2D();
    } else {
      acc = p5.Vector.sub(this.targetFood.pos, this.pos);

      // if food is in range, eat food
      if (acc.mag() <= this.mass / 2) {
        if (!this.trackingCreature) {
          food.splice(food.indexOf(this.targetFood), 1);
          this.targetFood = null;
          this.energy += 5000;
        } else {
          this.energy += this.targetFood.energy * 0.8;
          creatures.splice(creatures.indexOf(this.targetFood), 1);
          this.trackingCreature = false;
          this.targetFood = null;
        }
      }
    }

    this.vel.add(acc);
    this.vel.setMag(this.speedLimit);

    // boundaries check
    let newPos = p5.Vector.add(this.pos, this.vel);
    if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < width) {
      this.pos.add(this.vel);
    } else {
      this.vel = createVector(0, 0);
    }
  }

  // creates replica through asexual reproduction
  createBaby() {
    let baby = new Creature(this.pos.x, this.pos.y, this.color);
    baby.dna = this.dna.replicate();

    creatures.push(baby);
  }
  
  // creates new organism through sexual reproduction
  mate(partner) {
    let offspringDNA = this.dna.crossover(partner.dna, 0.15);
    let offspring = new Creature(this.pos.x, this.pos.y);
    offspring.dna.genes = offspringDNA;
    
    creatures.push(offspring);
  }

  // determines if there is food within seeing range
  see() {
    // unless tracking another creature, creature will try and find regular food
    if (!this.trackingCreature) {
      let smallestDist = 900;
      let smallestDistIndex = -1;
    
      for (let i = 0; i < food.length; i++) {
        let dist = p5.Vector.sub(food[i].pos, this.pos);

        if (dist.mag() <= this.range) {
          if (dist.mag() < smallestDist) {
            smallestDist = dist.mag();
            smallestDistIndex = i;
          }
        }
      }

      if (smallestDistIndex != -1) {
        this.targetFood = food[smallestDistIndex];
      }
    }

    // detect if another creature is in range
    // creature prioritizes eating other creatures over eating regular food
    // creature prioritizes mating over eating other creatures
    for (let i = 0; i < creatures.length; i++) {
      let dist = p5.Vector.sub(this.pos, creatures[i].pos);
      if (dist.mag() <= this.range && creatures[i] != this) {
        // 10 % chance the creature will mate with another in range
        if (random(1) < 0.1 & this.reproductionClock > 250) {
          this.mate(creatures[i]);
          this.lastMate = creatures[i];
          this.reproductionClock = 0;
        // otherwise, track it down to try and eat it if this creature is bigger
        // the random is something I call aggressiveness
        // it is purely so the creatures do not eat themselves to extinction
        } else if (random(1) < 0.01 && creatures[i].mass < this.mass && creatures[i] != this.lastMate) {
          this.targetFood = creatures[i];
          strokeWeight(1);
          stroke(0);
          line(this.pos.x, this.pos.y, creatures[i].pos.x, creatures[i].pos.y);
          this.trackingCreature = true;
        }
      }
    }

    if (debug && this.targetFood != null) {
      strokeWeight(1);
      stroke(0);
      line(this.pos.x, this.pos.y, this.targetFood.pos.x, this.targetFood.pos.y);
    }
  }

  show() {
    noStroke();
    if (debug) {
      fill(200, 200, 200, 100);
      ellipse(this.pos.x, this.pos.y, this.range * 2);
    }
    fill(50);
    ellipse(this.pos.x, this.pos.y, this.mass);
  }
}