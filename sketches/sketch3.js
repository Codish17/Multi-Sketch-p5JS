export default function (p) {

  let rectangles = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.rectMode(p.CORNER);
    p.noFill();
  };

  p.draw = function () {
    p.background(30);

    for (let r of rectangles) {
      p.stroke(r.col);
      p.strokeWeight(r.strokeWeight);
      p.rect(r.x, r.y, r.w, r.h);
    }
  };

  p.mousePressed = function () {
    let cx = p.width / 2;
    let cy = p.height / 2;

    let x1 = p.mouseX;
    let y1 = p.mouseY;

    let wMax = p.abs(cx - x1) * 2 + p.random(20, 200);
    let hMax = p.abs(cy - y1) * 2 + p.random(20, 200);

    let x2 = x1 < cx ? x1 + wMax : x1 - wMax;
    let y2 = y1 < cy ? y1 + hMax : y1 - hMax;

    let x = p.min(x1, x2);
    let y = p.min(y1, y2);
    let w = p.abs(x2 - x1);
    let h = p.abs(y2 - y1);

    let col = p.color(
      p.random(255),
      p.random(255),
      p.random(255)
    );

    let sWeight = p.random(1, 6);

    rectangles.push({
      x,
      y,
      w,
      h,
      col,
      strokeWeight: sWeight
    });
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

}
