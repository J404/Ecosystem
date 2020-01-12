class Creature {
  constructor(x, y) {
    // position values
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    // dna values / values from dna
    this.dna = new Dna();
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    this.targetFood = null;
    this.trackingCreature = false;

    this.motivation = {
      reproductiveUrge: 30,
      hunger: 0
    };
    this.status = "";
  }

  move() {
    // reset values
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    this.motivation.hunger += .01 + (this.speedLimit / 50);
    //this.motivation.reproductiveUrge += .01;

    let acc = 0;

    // Needs to eat more than it needs to mate
    if (this.motivation.hunger > this.motivation.reproductiveUrge) {
      // If there is food in range
      if (this.targetFood != null) {
        this.status = "found food";
        acc = p5.Vector.sub(this.targetFood.pos, this.pos);

        // if food is in range, eat food
        if (acc.mag() <= this.mass / 2) {
          if (!this.trackingCreature) {
            console.log(this.targetFood);
            food.splice(food.indexOf(this.targetFood), 1);
          } else {
            creatures.splice(creatures.indexOf(this.targetFood), 1);
            this.trackingCreature = false;
          }

          this.motivation.hunger -= 20;
          if (this.motivation.hunger < 0)
            this.motivation.hunger = 0;
          this.targetFood = null;
        }
      } else {
        this.status = "searching for food";
        acc = p5.Vector.random2D();

        // Try to find the closest food in its range
        const food = this.findFood();
        if (food != null) {
          this.targetFood = food;
        }
      }
    } else {
      this.status = "searching for mate";
      const mate = this.findMate();

      if (mate != null) {
        this.mate(mate);
      } else {
        acc = p5.Vector.random2D();
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

  findFood() {
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
      return food[smallestDistIndex];
    } else {
      return null;
    }
  }

  findMate() {
    for (let i = 0; i < creatures.length; i++) {
      let dist = p5.Vector.sub(this.pos, creatures[i].pos);
      if (dist.mag() <= this.range && creatures[i] != this) {
        return creatures[i];
      }
    }
  }

  // DEPRECATED
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

    /*
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
    */
   // ^^^ previous reproduction decider thing
   // rework later
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