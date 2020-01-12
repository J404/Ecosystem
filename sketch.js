let food = [];
let foodTick = 0;

let creatures = [];
let creatureStats;
let creatureHistory = [];
let infoTick = 0;

let debug = true;

function setup() {
  createCanvas(1000, 1000);
  
  for (let i = 0; i < 10; i++) {
    food[i] = new Food(random(width), random(height));
  }
  
  //for (let i = 0; i < 15; i++) {
    let sex = (random(1) < 0.5) ? "male" : "female";
    creatures[0] = new Creature(random(width), random(height));
  //}
  
  creatureStats = {
    num: 0,
    speed: [],
    mass: [],
    range: []
  };
  
}

function draw() {
  background(0, 125, 0);
  
  foodTick++;
  if (foodTick >= 10) {
    foodTick = 0;
    newFood();
  }
  
  for (let f of food) {
    f.show();
  }
  
  creatureStats.num = creatures.length;
  creatureStats.speed = [];
  creatureStats.mass = [];
  creatureStats.range = [];
  let totalSpeed = 0, totalMass = 0, totalRange = 0;
  
  for (let c of creatures) {
    //c.see();
    c.move();
    c.show();
    
    creatureStats.speed[creatureStats.speed.length] = c.speedLimit;
    creatureStats.mass[creatureStats.mass.length] = c.mass;
    creatureStats.range[creatureStats.range.length] = c.range;
    totalSpeed += c.speedLimit;
    totalMass += c.mass;
    totalRange += c.range;
  }
  
  infoTick++;
  if (infoTick > 100) {
    creatureHistory.push(creatureStats);
  }
  if (infoTick > 500 && debug) {
    infoTick = 0;
    console.log(creatureStats);
    console.log("Number of creatures: " + creatureStats.num);
    console.log("Average speed: " + totalSpeed / creatureStats.num);
    console.log("Average mass: " + totalMass / creatureStats.num);
    console.log("Average range: " + totalRange / creatureStats.num);
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