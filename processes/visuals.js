// This file holds the code for various things to draw relating to the creatures

// Draws the creatures itself
const drawCreature = (pos, size) => {
    noStroke();
    fill(50);
    ellipse(pos.x, pos.y, size);
}

// Draws a line to the target foodPiece from the creature
const drawLineToTarget = (pos, target) => {
    strokeWeight(1);
    stroke(0);
    line(pos.x, pos.y, target.pos.x, target.pos.y);
    noStroke();
}

// Draws the creature's sight range
const drawRange = (pos, range) => {
    noStroke();
    fill(200, 200, 200, 100);
    ellipse(pos.x, pos.y, range * 2);
}

// Displays the creatures motivations as bars
const drawMotivations = (pos, motivations) => {
    noStroke();

    let yOffset = 50;

    for (let urge in motivations) {
        fill(150, 175);
        rect(pos.x - 50, pos.y + yOffset, 100, 25);
        fill(255, 255, 255, 175);
        rect(pos.x - 50, pos.y + yOffset, motivations[urge], 25);
        fill(0);
        text(urge, pos.x - 50, pos.y + yOffset + 10);

        yOffset += 30;
    }
}


// Shows the creature's current status
const drawStatus = (pos, status) => {
    noStroke();
    text(status, pos.x, pos.y - 50);
}