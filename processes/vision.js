// File for all of the methods pertaining to creature sight

// Takes in the position and range of the creature and calculates the closest food
// If no food is found, it returns null
const findFood = (pos, range) => {
  let smallestDist = 900;
  let smallestDistIndex = -1;
    
  for (let i = 0; i < food.length; i++) {
    let dist = p5.Vector.sub(food[i].pos, pos);
    if (dist.mag() <= range) {
      if (dist.mag() < smallestDist) {
        smallestDist = dist.mag();
        smallestDistIndex = i;
      }
    }
  }

  if (smallestDistIndex > -1) {
    return food[smallestDistIndex];
  } else {
    return null;
  }
}

// Takes in the position and range and returns a creature within range
// Returns null if no food is found
// TODO: add requirements for which creatures are 'mateable'
const findMate = (pos, range, sex) => {
  for (let i = 0; i < creatures.length; i++) {
    const dist = p5.Vector.sub(pos, creatures[i].pos);

    // If the creature is within range, return it
    // The second condition ensures the creature within range is not the creature
    // trying to find a mate (doesn't find itself as a mate)
    if (dist.mag() <= range && dist.mag() > 0 && creatures[i].sex != sex) {
      return creatures[i];
    }
  }

  // Will only reach this point if no creatures within range have been found
  return null;
}