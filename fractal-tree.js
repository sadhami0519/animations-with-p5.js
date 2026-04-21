// Fractal Tree — Starry Night + Ground + Grass
// Run at editor.p5js.org or locally with p5.js

let depthSlider, speedSlider, lenSlider;
let stars  = [];
let comets = [];
let grassBlades = [];

const NUM_STARS      = 220;
const NUM_GRASS      = 320;
const COMET_INTERVAL = 3500;
let lastComet = 0;

// Ground sits at this fraction of canvas height
const GROUND_Y_RATIO = 0.88;

// ── Setup ─────────────────────────────────────────────────────────────────────

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  frameRate(60);

  generateStars();
  generateGrass();

  let y = height - 36;
  createElement('label', 'Depth').style('color', '#aaa').style('font-size', '13px').position(10, y - 2);
  depthSlider = createSlider(3, 11, 8, 1).position(58, y).style('width', '110px');

  createElement('label', 'Speed').style('color', '#aaa').style('font-size', '13px').position(185, y - 2);
  speedSlider = createSlider(1, 10, 4, 1).position(233, y).style('width', '110px');

  createElement('label', 'Length').style('color', '#aaa').style('font-size', '13px').position(360, y - 2);
  lenSlider = createSlider(60, 140, 95, 1).position(412, y).style('width', '110px');
}

// ── Stars ─────────────────────────────────────────────────────────────────────

function generateStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x:       random(width),
      y:       random(height * GROUND_Y_RATIO * 0.95),
      size:    random(0.5, 2.5),
      twinkle: random(TWO_PI),
      speed:   random(0.01, 0.04),
      bright:  random(160, 255)
    });
  }
}

// ── Grass ─────────────────────────────────────────────────────────────────────

function generateGrass() {
  grassBlades = [];
  let groundY = height * GROUND_Y_RATIO;

  for (let i = 0; i < NUM_GRASS; i++) {
    let x = random(width);
    let distFromCenter = abs(x - width / 2) / (width / 2);
    let baseH = random(14, 38) + (1 - distFromCenter) * 12;

    grassBlades.push({
      x:         x,
      baseY:     groundY + random(-3, 5),
      h:         baseH,
      lean:      random(-0.35, 0.35),
      tipOffX:   random(-6, 6),
      swayPhase: random(TWO_PI),
      swayAmp:   random(0.03, 0.10),
      r: random(20, 55),
      g: random(70, 120),
      b: random(15, 40),
      w: random(1.0, 2.2)
    });
  }

  // Sort back-to-front so taller blades sit behind shorter foreground ones
  grassBlades.sort((a, b) => a.h - b.h);
}

// ── Main draw ─────────────────────────────────────────────────────────────────

function draw() {
  drawSky();
  drawStars();
  spawnAndDrawComets();
  drawGround();
  drawGrass();

  let maxDepth = depthSlider.value();
  let speed    = speedSlider.value() * 0.0008;
  let baseLen  = lenSlider.value();
  let t        = millis() * speed;

  push();
  translate(width / 2, height * GROUND_Y_RATIO);
  drawBranch(baseLen, maxDepth, maxDepth, t);
  pop();

  // Slider labels
  fill(170);
  noStroke();
  textSize(12);
  textAlign(LEFT);
  let labelY = height - 32;
  text(depthSlider.value(), 175, labelY);
  text(speedSlider.value(), 350, labelY);
  text(lenSlider.value(),   530, labelY);
}

// ── Sky ───────────────────────────────────────────────────────────────────────

function drawSky() {
  let groundY = height * GROUND_Y_RATIO;
  for (let i = 0; i <= groundY; i++) {
    let t = i / groundY;
    stroke(lerp(5, 20, t), lerp(8, 35, t), lerp(30, 65, t));
    line(0, i, width, i);
  }
}

function drawStars() {
  noStroke();
  for (let s of stars) {
    s.twinkle += s.speed;
    let alpha = map(sin(s.twinkle), -1, 1, 80, s.bright);
    fill(255, 255, 220, alpha);
    ellipse(s.x, s.y, s.size, s.size);
    if (s.size > 1.8) {
      fill(255, 255, 200, alpha * 0.15);
      ellipse(s.x, s.y, s.size * 4, s.size * 4);
    }
  }
}

// ── Ground ────────────────────────────────────────────────────────────────────

function drawGround() {
  let groundY = height * GROUND_Y_RATIO;
  let groundH = height - groundY;

  // Muddy earth gradient
  for (let i = 0; i <= groundH; i++) {
    let t = i / groundH;
    stroke(lerp(38, 55, t), lerp(25, 35, t), lerp(12, 18, t));
    line(0, groundY + i, width, groundY + i);
  }

  // Surface texture: random mud clumps and pebbles
  randomSeed(42);
  noStroke();
  for (let i = 0; i < 180; i++) {
    let px   = random(width);
    let py   = groundY + random(2, groundH * 0.5);
    let pr   = random(1, 4);
    let dark = random(15, 35);
    fill(dark + 18, dark + 10, dark, random(60, 130));
    ellipse(px, py, pr * 2, pr);
  }

  // Thin wet mud strip at sky/ground edge
  noStroke();
  fill(55, 42, 20, 200);
  rect(0, groundY - 1, width, 3);
}

// ── Grass ─────────────────────────────────────────────────────────────────────

function drawGrass() {
  let t = millis() * 0.0006;

  for (let g of grassBlades) {
    let sway  = sin(t * 1.2 + g.swayPhase) * g.swayAmp;
    let bx    = g.x;
    let by    = g.baseY;
    let halfW = g.w * 0.9;

    // Tip: leans + sways + natural curve
    let tipX = bx + g.tipOffX + sin(sway + g.lean) * g.h * 0.55;
    let tipY = by - g.h;

    // Draw blade as a narrow four-point polygon for a natural taper
    noStroke();
    fill(g.r, g.g, g.b, 220);
    beginShape();
    vertex(bx - halfW, by);
    vertex(bx + halfW, by);
    vertex(tipX + halfW * 0.3, tipY + g.h * 0.4);
    vertex(tipX, tipY);
    endShape(CLOSE);

    // Faint centre vein
    stroke(min(g.r + 20, 90), min(g.g + 30, 150), min(g.b + 10, 55), 60);
    strokeWeight(0.4);
    line(bx, by, tipX, tipY);
  }
}

// ── Comets ────────────────────────────────────────────────────────────────────

function spawnAndDrawComets() {
  if (millis() - lastComet > COMET_INTERVAL + random(-800, 800)) {
    spawnComet();
    lastComet = millis();
  }
  for (let i = comets.length - 1; i >= 0; i--) {
    let c = comets[i];
    c.x     += c.vx;
    c.y     += c.vy;
    c.alpha -= c.fade;
    drawComet(c);
    if (c.x > width + 100 || c.y > height + 100 || c.alpha <= 0) comets.splice(i, 1);
  }
}

function spawnComet() {
  comets.push({
    x:     random(-80, width * 0.5),
    y:     random(-40, height * 0.3),
    vx:    random(6, 14),
    vy:    random(3, 7),
    len:   random(80, 160),
    alpha: 255,
    fade:  random(1.5, 3),
    size:  random(1.5, 3)
  });
}

function drawComet(c) {
  let angle = atan2(c.vy, c.vx);
  let steps = 18;
  for (let i = 0; i < steps; i++) {
    let t     = i / steps;
    let alpha = c.alpha * (1 - t) * 0.7;
    stroke(200, 220, 255, alpha);
    strokeWeight(lerp(c.size, 0.2, t));
    line(
      c.x - cos(angle) * t * c.len,
      c.y - sin(angle) * t * c.len,
      c.x - cos(angle) * (t + 1 / steps) * c.len,
      c.y - sin(angle) * (t + 1 / steps) * c.len
    );
  }
  noStroke();
  fill(240, 248, 255, c.alpha * 0.3);
  ellipse(c.x, c.y, c.size * 5, c.size * 5);
  fill(255, 255, 255, c.alpha);
  ellipse(c.x, c.y, c.size, c.size);
}

// ── Fractal tree ──────────────────────────────────────────────────────────────

function drawBranch(len, depth, maxDepth, t) {
  if (depth === 0) return;

  let ratio = depth / maxDepth;
  strokeWeight(map(ratio, 0, 1, 1, maxDepth * 0.6));
  stroke(
    map(ratio, 0, 1, 50, 120),
    map(ratio, 0, 1, 180, 100),
    map(ratio, 0, 1, 25, 45)
  );

  line(0, 0, 0, -len);
  translate(0, -len);

  let swing     = sin(t + depth * 0.4) * 0.22;
  let baseAngle = 0.45 + sin(t * 0.7) * 0.08;
  let shrink    = 0.68 + sin(t * 0.3 + depth) * 0.03;

  push(); rotate(baseAngle + swing);
  drawBranch(len * shrink, depth - 1, maxDepth, t);
  pop();

  push(); rotate(-baseAngle + swing * 0.8);
  drawBranch(len * (shrink - 0.04), depth - 1, maxDepth, t);
  pop();

  if (depth > 2 && depth < maxDepth - 1) {
    push();
    rotate((baseAngle * 0.4 + swing * 0.5) * sin(t * 1.1 + depth));
    drawBranch(len * (shrink - 0.1), depth - 1, maxDepth, t);
    pop();
  }
}

// ── Resize ────────────────────────────────────────────────────────────────────

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateStars();
  generateGrass();
}
