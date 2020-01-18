class Creature {
  constructor(x, y) {
    // position values
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    // intial traits from dna
    this.dna = new Dna();
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    // 50% chance the creature is a male or female
    this.sex = (random(1) < 0.5) ? "male" : "female";

    this.targetFood = null;
    this.targetMate = null;
    this.trackingCreature = false;

    // Female specific traits
    // May use inheritance later and set up a separate class
    this.gestating = false;
    this.gestatingPeriod = this.dna.genes.gestationPeriod;
    this.partner;
    this.birthCooldown = 0;

    // Object containing the 'urges' that influence the creature's behavior
    this.motivation = {
      reproductiveUrge: this.dna.genes.reproductiveUrge,
      hunger: 0
    };

    this.status = "";
  }

  // Uses the creature's various urges to determine what it needs to do,
  // then returns a vector of acceleration in the direction of that goal
  decideGoal() {

    // If the hunger is greater than the urge to reproduce, the creature will try to find food
    // If the creature is gestating, it will default to search for food
    if ((this.motivation.hunger > this.motivation.reproductiveUrge) || this.gestating) {

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
        if (checkEdible(this.targetFood, this.pos, this.mass / 2)) {
          // Reduce the hunger by 20
          // If hunger is already at 0, keep it at 0
          this.motivation.hunger = (this.motivation.hunger - 20 <= 0) ? 0 : this.motivation.hunger - 20;
      
          // Reset the target food
          this.targetFood = null;
          return 0;
        } else {
          return p5.Vector.sub(this.targetFood.pos, this.pos);
        }
      }
    // Add future urges here
    // For now, if hunger is not greater than urge to reproduce the creature will try and find a mate
    } else if (!this.gestating) {

      // Search the creatures range for any mates w/ findMate
      this.targetMate = findMate(this.pos, this.range, this.sex);

      // If a mate is not yet found, search for a mate
      if (this.targetMate == null) {
        this.status = "searching for a mate";

        // Set the acceleration to random to try and find mate
        return p5.Vector.random2D();

      // If a mate is found, we target that mate
      } else if (checkMateable(this, this.targetMate)) {
        this.status = "found a mate";

        // Arbitrarily, reproduction is initiated by males
        if (this.sex == "male") {

          // Checks if the two creatures are touching before mating begins
          const dist = p5.Vector.sub(this.pos, this.targetMate.pos);
          const inRange = dist.mag() < this.mass / 2;

          if (inRange) {
            mate(this, this.targetMate);

            return 0;
          } else {
            return p5.Vector.sub(this.targetMate.pos, this.pos);
          }
        } else {
          return p5.Vector.sub(this.targetMate.pos, this.pos);
        }
      }
    }
  }

  move() {
    // reset values
    this.speedLimit = this.dna.genes.speed;
    this.mass = this.dna.genes.mass;
    this.range = this.dna.genes.range;

    // Exponential function to determine how much hunger is generated per step
    // more speed results in greater hunger loss
    this.motivation.hunger += .05 * Math.pow(1.5, this.speedLimit - 3);

    // If our hunger is greater than 100, the creature is dead
    if (this.motivation.hunger > 100) {
      creatures.splice(creatures.indexOf(this), 1);
    }

    // If gestating, we lower the clock by one
    // If the gestating period is at 0 the female is ready to give birth
    if (this.sex == "female") {
      if (this.gestating) {
        this.gestatingPeriod--;

        if (this.gestatingPeriod <= 0) {
          this.gestating = false;

          // Change this to be  based off dna later
          this.gestatingPeriod = 500;
          this.birthCooldown = 500;

          reproduce(this.partner, this);
        }
    } else if (this.birthCooldown > 0)
      this.birthCooldown--;
    }

    // Get a goal direction from decide goal, then use that to control velocity/position
    const acc = this.decideGoal();
    this.vel.add(acc);
    this.vel.setMag(this.speedLimit);

    // boundaries check
    const newPos = p5.Vector.add(this.pos, this.vel);
    if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < width) {
      this.pos.add(this.vel);
    } else {
      this.vel = createVector(0, 0);
    }
  }

  show() {

    // If we are in debug mode it will display each creature's range,
    // motivations, status, and target
    if (debug) {
      drawRange(this.pos, this.range);

      if (this.targetFood != null)
        drawLineToTarget(this.pos, this.targetFood);

      drawMotivations(this.pos, this.motivation);

      drawStatus(this.pos, this.status);
    }

    // Always draw the creature itself
    drawCreature(this.pos, this.mass);
  }
}