export default function (p) {

  let lines = [
    "I walked and stopped a lot. ",
    "Such contrast in one frame. ",
    "Two worlds, five minutes apart. "
  ];

  let textStream = "";

  // HTML elements
  let inputBox;
  let generateButton;
  let downloadButton;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textSize(19);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255);
    p.noStroke();

    // Create textarea for input
    inputBox = p.createElement('textarea');
    inputBox.position(20, 20);
    inputBox.size(300, 100);
    inputBox.value(lines.join("\n"));

    // Generate button
    generateButton = p.createButton('Generate Spiral');
    generateButton.position(20, 130);
    generateButton.mousePressed(generateSpiral);

    // Download button
    downloadButton = p.createButton('Download Image');
    downloadButton.position(20, 160);
    downloadButton.mousePressed(() =>
      p.saveCanvas('spiral_text', 'png')
    );

    generateSpiral();
  };

  function generateSpiral() {
    p.background(10);

    lines = inputBox.value().split("\n");
    textStream = lines.join("   ");

    drawSpiral();
  }

  function drawSpiral() {
    p.push();
    p.translate(p.width / 2, p.height / 2);

    let angle = 0;
    let radius = 8;
    let i = 0;

    let maxRadius =
      p.dist(0, 0, p.width / 2, p.height / 2) + 50;

    while (radius < maxRadius) {
      let ch = textStream[i % textStream.length];
      let w = p.textWidth(ch);

      let x = p.cos(angle) * radius;
      let y = p.sin(angle) * radius;

      let tangent = angle + p.HALF_PI;

      p.push();
      p.translate(x, y);
      p.rotate(tangent);
      p.text(ch, 0, 0);
      p.pop();

      let arcLen = w * 0.8;
      let dTheta = arcLen / p.max(radius, 1);

      angle += dTheta;
      radius += 0.01 * arcLen;

      i++;
    }

    p.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    generateSpiral();
  };

  p.draw = function () {
    // static sketch
  };

}
