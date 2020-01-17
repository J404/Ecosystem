class Creature {
  constructor(x, y) {
    // position values
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    // dna values / values from dna
    // ***************************************************
    // TODO: MAKE REPRODUCTIVE URGE A GENE
    // TODO: MAKE GESTATION A GENE
    // ***************************************************
    this.dna = new Dna();
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    this.sex = (random(1) < 0.5) ? "male" : "female";

    this.targetFood = null;
    this.targetMate = null;
    this.trackingCreature = false;

    this.gestating = false;
    this.gestatingPeriod = 500;

    this.motivation = {
      reproductiveUrge: 30,
      hunger: 0
    };

    this.status = "";
  }

  // Uses the creature's various urges to determine what it needs to do,
  // then returns a vector of acceleration in the direction of that goal
  decideGoal() {

    // If the hunger is greater than the urge to reproduce, the creature will try to find food
    if (this.motivation.hunger > this.motivation.reproductiveUrge) {

      // findFood method will search within creature's range and return closest food
      this.targetFood = findFood(this.pos, this.range);

      // If there is no food within range, it will return null
      if (this.targetFood == null) {
        this.status = "searching for food";

        // Set the acceleration to random to try and find food
        return p5.Vector.random2D();
      
      // Otherwise, there is food found and we target it
      } else {
        this.status = "found food";
        if (this.checkEdible(p5.Vector.sub(this.targetFood.pos, this.pos).mag()))
          return 0;
        else
          return p5.Vector.sub(this.targetFood.pos, this.pos);
      }
    // Add future urges here
    // For now, if hunger is not greater than urge to reproduce the creature will try and find a mate
    } else {

      // Search the creatures range for any mates w/ findMate
      this.targetMate = findMate(this.pos, this.range);

      // If a mate is not yet found, search for a mate
      if (this.targetMate == null) {
        this.status = "searching for a mate";

        // Set the acceleration to random to try and find mate
        return p5.Vector.random2D();

      // If a mate is found, we target that mate
      } else {
        this.status = "found a mate";
        return p5.Vector.sub(this.targetMate.pos, this.pos);
      }
    }
  }

  // Checks if the creature is able to eat a piece of food;
  // if it is in range, the creature will eat the food
  checkEdible(dist) {
    // Checks if the food is in range
    if (dist < this.mass / 2) {

      // Delete the food from the food array
      food.splice(food.indexOf(this.targetFood), 1);

      // Reduce the hunger by 20
      // If hunger is already at 0, keep it at 0
      this.motivation.hunger = (this.motivation.hunger <= 0) ? 0 : this.motivation.hunger - 20;
      
      // Reset the target food
      this.targetFood = null;

      return true;
    }

    // If we cant eat it, return false
    return false;
  }

  move() {
    // reset values
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    // Exponential function to determine how much hunger is generated per step
    // more speed results in greater hunger loss
    this.motivation.hunger += .05 * Math.pow(1.25, this.speedLimit - 3);

    // Get a goal direction from decide goal, then use that to control velocity/position
    const acc = this.decideGoal();
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

  show() {
    noStroke();
    if (debug) {
      fill(200, 200, 200, 100);
      ellipse(this.pos.x, this.pos.y, this.range * 2);

      if (this.targetFood != null) {
        strokeWeight(1);
        stroke(0);
        line(this.pos.x, this.pos.y, this.targetFood.pos.x, this.targetFood.pos.y);
        noStroke();
      }

      let yOffset = 50;
      for (let urge in this.motivation) {
        fill(150, 175);
        rect(this.pos.x - 50, this.pos.y + yOffset, 100, 25);
        fill(255, 255, 255, 175);
        rect(this.pos.x - 50, this.pos.y + yOffset, this.motivation[urge], 25);
        fill(0);
        text(urge, this.pos.x - 50, this.pos.y + yOffset + 10);

        yOffset += 30;
      }

      text(this.status, this.pos.x, this.pos.y - 50);
    }
    fill(50);
    ellipse(this.pos.x, this.pos.y, this.mass);
  }
}