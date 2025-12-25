export default function (p) {

  let cols, rows;
  let boxes = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.rectMode(p.CENTER);
    p.noStroke();

    cols = p.max(1, p.floor(p.width / 50));
    rows = p.max(1, p.floor(p.height / 50));

    let w = p.width / cols;
    let h = p.height / rows;

    boxes = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * w + w / 2;
        let y = j * h + h / 2;

        let d = p.dist(x, y, p.width / 2, p.height / 2);
        let yCol = p.map(d, 0, p.width / 2, 240, 210);

        boxes.push({
          x,
          y,
          ox: x + p.random(-8, 8),
          oy: y + p.random(-8, 8),
          w: w * p.random(0.55, 0.8),
          h: h * p.random(0.55, 0.8),
          c: p.color(255, yCol, 0, 190)
        });
      }
    }
  };

  p.draw = function () {
    p.background(255);

    for (let b of boxes) {
      let d = p.dist(p.mouseX, p.mouseY, b.x, b.y);
      let force = p.max(0, 200 - d);

      let mouseAngle = p.atan2(b.y - p.mouseY, b.x - p.mouseX);
      let n = p.noise(b.ox * 0.003, b.oy * 0.003);
      let fieldAngle = n * p.TWO_PI * 2;

      let angle = p.lerp(mouseAngle, fieldAngle, 0.4);

      let tx = b.ox + p.cos(angle) * force * 0.15;
      let ty = b.oy + p.sin(angle) * force * 0.15;

      let calmness = b.ox < p.width / 2 ? 0.04 : 0.1;
      b.x = p.lerp(b.x, tx, calmness);
      b.y = p.lerp(b.y, ty, calmness);

      p.fill(b.c);
      p.rect(b.x, b.y, b.w, b.h, 4);
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.setup();
  };

}
