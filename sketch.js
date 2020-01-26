let food = [];
let foodTick = 0;

let creatures = [];
const startingNumCreatures = 10;
let creatureStats;
let creatureHistory = [];
let infoTick = 0;

let debug = true;

const environmentWidth = 1500;
const environmentHeight = 1500;

function setup() {
  createCanvas(2000, 1500);

  initGraph();
  
  for (let i = 0; i < 10; i++) {
    food[i] = new Food(random(environmentWidth), random(environmentHeight));
  }
  
  for (let i = 0; i < startingNumCreatures; i++) {
    creatures[i] = new Creature(random(environmentWidth), random(environmentHeight));
    if (i % 2 == 0) {
      creatures[i].sex = "female";
    } else {
      creatures[i].sex = "male";
    }
  }
  
  creatureStats = {
    num: 0,
    speed: [],
    mass: [],
    range: []
  };
  
}

function draw() {
  background(0, 125, 0);

  drawGraph("num", environmentWidth, 0, 500, 200);
  drawGraph("speed", environmentWidth, 220, 500, 200);
  drawGraph("mass", environmentWidth, 440, 500, 200);
  drawGraph("range", environmentWidth, 660, 500, 200);
  drawGraph("gestationPeriod", environmentWidth, 880, 500, 200);
  drawGraph("reproductiveUrge", environmentWidth, 1100, 500, 200);
  drawGraph("numOffspring", environmentWidth, 1320, 500, 200);
  
  foodTick++;
  if (foodTick >= 10) {
    foodTick = 0;
    newFood();
  }
  
  for (let f of food) {
    f.show();
  }
  
  for (let c of creatures) {
    c.move();
    c.show();
  }
  
  infoTick++;
  if (infoTick > 100) {
    creatureHistory.push(creatureStats);
  }
  if (infoTick > 500 && debug) {
    infoTick = 0;

    const creatureStats = {};

    for (let gene in creatures[0].dna.genes) {
      let geneVals = [];

      for (let c of creatures) {
        geneVals.push(c.dna.genes[gene]);
      }

      const avgVal = average(geneVals);
      creatureStats[gene] = avgVal;
    }

    creatureStats.num = creatures.length;
    addData(creatureStats);
  }
}

function newFood() {
  food[food.length] = new Food(random(0, environmentWidth), random(0, environmentHeight));
}

function keyPressed() {
  switch(key) {
    case "p":
      noLoop();
      break;
    case "r":
      loop();
      break;
    case "d":
      debug = (debug) ? false : true;
      break;
  }
}