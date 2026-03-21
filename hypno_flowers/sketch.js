let flowers = [];
let flo_num = 18;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  // Flower(r, pts, f_amp, period, speed, rotate)
  for(let i = 0; i < flo_num; i++) {
    if(i % 2 == 0) {
   flowers[i] = new Flower(180- i*10, 100, 15, 7, (i+1)*0.2, 1); 
    }
    else {
      flowers[i] = new Flower(140 - i*10, 100, 15, 7, (i+1)*-0.2, 1); 
    }
  }
}

function draw() {
  background(0);
  translate(width/2, height/2);
  for(let i = 0; i < flo_num; i++) {
   flowers[i].display();
  }
}