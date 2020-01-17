// Checks if the creature is able to eat a piece of food;
// if it is in range, the creature will eat the food
const checkEdible = (foodPiece, pos, radius) => {

  // Checks if the food is in range
  const dist = p5.Vector.sub(foodPiece.pos, pos).mag();
  if (dist < radius / 2) {

    // Delete the food from the food array
    food.splice(food.indexOf(foodPiece), 1);

    return true;
  }

  // If we cant eat it, return false
  return false;
}