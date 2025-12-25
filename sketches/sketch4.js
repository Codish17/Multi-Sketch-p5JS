// sketches/sketch4.js
export default function (p) {
  let cols = 8;
  let rows = 6;
  let snowflakes = [];
  let cellW, cellH;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    cellW = p.width / cols;
    cellH = p.height / rows;

    // Create snowflakes per grid cell
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let density = p.random(18, 45);
        for (let k = 0; k < density; k++) {
          snowflakes.push(
            new Snowflake(
              p.random(i * cellW, (i + 1) * cellW),
              p.random(j * cellH, (j + 1) * cellH),
              i,
              j,
              p
            )
          );
        }
      }
    }
    p.noStroke();
  };

  p.draw = function () {
    p.background(10, 15, 25); // deep winter night
    for (let flake of snowflakes) {
      flake.update();
      flake.display();
    }
  };

  p.mousePressed = function () {
    for (let flake of snowflakes) {
      flake.pushFrom(p.mouseX, p.mouseY);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    cellW = p.width / cols;
    cellH = p.height / rows;
  };

  /* ===================== SNOW ===================== */
  class Snowflake {
    constructor(x, y, ci, cj, p) {
      this.p = p;
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.cell = p.createVector(ci, cj);
      this.size = p.random([0.8, 1.2, 1.6, 2.2, 3, 3.8]);
      this.speed = p.map(this.size, 0.8, 3.8, 0.3, 1.6);
      this.opacity = p.map(this.size, 0.8, 3.8, 120, 210);
      this.noiseOffset = p.random(1000);
    }

    update() {
      let d = this.p.dist(this.pos.x, this.pos.y, this.p.mouseX, this.p.mouseY);
      let slowFactor = this.p.map(d, 0, 200, 0.08, 1, true);
      let drift = this.p.map(this.p.noise(this.noiseOffset), 0, 1, -0.6, 0.6);
      this.vel.x += drift * 0.02;
      this.vel.y += this.speed * 0.02;
      this.vel.mult(0.96);
      this.pos.add(p5.Vector.mult(this.vel, slowFactor));
      this.noiseOffset += 0.01;

      if (this.pos.y > this.p.height) {
        this.pos.y = -10;
        this.pos.x = this.p.random(this.cell.x * cellW, (this.cell.x + 1) * cellW);
        this.vel.mult(0);
      }
    }

    pushFrom(x, y) {
      let dir = p5.Vector.sub(this.pos, p.createVector(x, y));
      let d = dir.mag();
      if (d < 160) {
        dir.normalize();
        let strength = p.map(d, 0, 160, 2.5, 0);
        this.vel.add(dir.mult(strength));
      }
    }

    display() {
      this.p.fill(240, 245, 255, this.opacity);
      this.p.circle(this.pos.x, this.pos.y, this.size);
    }
  }
}
