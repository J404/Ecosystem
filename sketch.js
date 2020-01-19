let food = [];
let foodTick = 0;

let creatures = [];
const startingNumCreatures = 10;
let creatureStats;
let creatureHistory = [];
let infoTick = 0;

let debug = true;

function setup() {
  createCanvas(1500, 1500);

  initGraph();

  let data = {
    speed: 4, 
    mass: 13, 
    range: 82,
    gestationPeriod: 222,
    reproductiveUrge: 99,
    numOffspring: 1
  }
  addData(data);
  
  for (let i = 0; i < 10; i++) {
    food[i] = new Food(random(width), random(height));
  }
  
  for (let i = 0; i < startingNumCreatures; i++) {
    creatures[i] = new Creature(random(width), random(height));
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

  drawGraph("num", 0, 0, 500, 200);
  
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
  food[food.length] = new Food(random(0, width), random(0, height));
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