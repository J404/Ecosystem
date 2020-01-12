class Food {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }
  
  show() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 5);
  }
}