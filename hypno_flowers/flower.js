class Flower {
  constructor(r, pts, f_amp, period, speed, rotate) {
    this.x = [];
    this.y = [];
    this.r = r;
    
    this.pts = pts;
    this.f_radius = 0;
    this.f_amp = f_amp;
    this.period = period;
    
    this.speed = speed;
    this.rotate = rotate;
  }
  
  display() {
    push();
    blendMode(DIFFERENCE);
    noStroke();
    fill(255);
    beginShape();
    for(let i = 0; i < this.pts; i++) {
      let angle = i/this.pts * 360;
      this.f_radius = this.f_amp*cos(angle * this.period)
      this.x[i] = (this.r + this.f_radius)*cos(angle + this.rotate);
      this.y[i] = (this.r + this.f_radius)*sin(angle + this.rotate);
      vertex(this.x[i], this.y[i]);
    }
    this.rotate += this.speed;
    endShape(CLOSE);
    pop();
  }
}