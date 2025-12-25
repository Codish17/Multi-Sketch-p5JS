export default function (p) {

  let cols = 8;
  let rows = 6;

  let snowflakes = [];
  let cellW, cellH;

  /* ===================== SETUP ===================== */

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    cellW = p.width / cols;
    cellH = p.height / rows;

    snowflakes = [];

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
              j
            )
          );
        }
      }
    }

    p.noStroke();
  };

  /* ===================== DRAW ===================== */

  p.draw = function () {
    p.background(10, 15, 25); // deep winter night

    for (let flake of snowflakes) {
      flake.update();
      flake.display();
    }
  };

  /* ===================== SNOWFLAKE CLASS ===================== */

  class Snowflake {
    constructor(x, y, ci, cj) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.cell = p.createVector(ci, cj);

      this.size = p.random([0.8, 1.2, 1.6, 2.2, 3, 3.8]);
      this.speed = p.map(this.size, 0.8, 3.8, 0.3, 1.6);
      this.opacity = p.map(this.size, 0.8, 3.8, 120, 210);

      this.noiseOffset = p.random(1000);
    }

    update() {
      // slow near mouse
      let d = p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
      let slowFactor = p.map(d, 0, 200, 0.08, 1, true);

      // sideways drift
      let drift = p.map(p.noise(this.noiseOffset), 0, 1, -0.6, 0.6);

      // base motion
      this.vel.x += drift * 0.02;
      this.vel.y += this.speed * 0.02;

      // damping
      this.vel.mult(0.96);

      this.pos.add(p5.Vector.mult(this.vel, slowFactor));
      this.noiseOffset += 0.01;

      // wrap around
      if (this.pos.y > p.height) {
        this.pos.y = -10;
        this.pos.x = p.random(
          this.cell.x * cellW,
          (this.cell.x + 1) * cellW
        );
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
      p.fill(240, 245, 255, this.opacity);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  /* ===================== INTERACTION ===================== */

  p.mousePressed = function () {
    for (let flake of snowflakes) {
      flake.pushFrom(p.mouseX, p.mouseY);
    }
  };

  /* ===================== RESIZE ===================== */

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    cellW = p.width / cols;
    cellH = p.height / rows;
  };
}
