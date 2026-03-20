let x; let y; let r = 150; let angle = 0;
let shiftingAngle = [];
let numAxis = 8;
let x2 = [];
let y2 = [];

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  for(let i = 0; i <= numAxis; i++) {
    shiftingAngle[i] = i*90/numAxis;
  }
}

function draw() {
  background(3, 138, 230);
  stroke(250);
  // angle = map(mouseX, 0, width, 0, 360);
  x = r*cos(angle);
  y = r*sin(angle);

  noFill();
  translate(width/2, height/2);
  ellipse(0, 0, r*2, r*2);
  
  fill(247, 141, 167);
  ellipse(x, y, 20, 20);
  
  for(let i = 0; i < numAxis; i++) {
      
    x2[i] = r*cos(angle + shiftingAngle[i]);
    y2[i] = r*sin(angle + shiftingAngle[i]);
    push();
    rotate(-shiftingAngle[i]);
    line(-r, 0, r, 0);
    line(0, r, 0, -r);
    fill(250);
    ellipse(x2[i], 0, 20, 20);
    ellipse(0, y2[i], 20, 20);
    pop();
  }
  
  angle += 2;
}