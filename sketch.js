let system;
let index1 = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  system = new ParticleSystem(createVector(width / 2, 50));
  
  drawingContext.shadowColor = 'red';
  drawingContext.shadowBlur = 15;
}

function draw() {
  background(33);
  fill(255)
  text('Current second: \n' + frameRate(), 5, 50);
  index1++;
  if (index1 => 2) {
    system.addParticle();
    index1 = 0;
  }
  system.run();

}

// A simple Particle class
let Particle = function(position, a) {
  this.acceleration = createVector(0, 0.01);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  if(a == 1){
  this.position = createVector(position.x, position.y);
  }
  else{
  
  this.position = createVector(random(0, width), random(0, height));
  }
  this.lifespan = 255;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 4;
};

// Method to display
Particle.prototype.display = function() {
  push()
  // noStroke();
  // drawingContext.shadowColor = ("rgba(255," +    this.position.x/width*255 +"," +(this.position.x/width -this.position.y/height)*255 +","+ this.position.y/height*255 + "," + this.lifespan/255.0+")");
  // console.log()
  // console.log('rgba(255, ${this.position.x/width*255 }, ${(this.position.x/width -this.position.y/height)*255}, ${this.position.y/height*255 }, 0.5')
  let st = "rgba("  + Math.floor(this.position.x/width*255) +"," + Math.floor((this.position.x/width -this.position.y/height)*255) +","+ Math.floor(this.position.y/height*255)+", 0.2)";
  drawingContext.shadowColor = "rgba(255,255,255,1)";
  drawingContext.shadowBlur = 12;
  strokeWeight(5)
  stroke(255 - this.position.x/width*255,
       (this.position.x/width -this.position.y/height)*255, 
        this.position.y/height*255,this.lifespan-100);
  // fill(255 - this.position.x/width*255,
  //      (this.position.x/width -this.position.y/height)*255, 
  //       this.position.y/height*255,this.lifespan);
  fill(255, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
  pop()
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
  if(this.position.x <5 || this.position.x >5+width ||
     this.position.y <5 || this.position.y >5+height)
    return true
  return this.lifespan < 0;
};

let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle1 = function(position) {
  this.particles.push(new Particle(position, 1));
};
ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  drawingContext.shadowBlur = 0;
  // drawingContext.shadowColor = "white";
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p1 = this.particles[i].position
    for (let j = i-1; j >= 0; j--) {
      let p2 = this.particles[j].position
      dist1 = 255- p1.dist(p2)*2
      if (dist1 > 0) {
        push()
        strokeWeight(Math.floor(dist1/20))
        stroke(255- p1.x/width*255,
             (p1.x/width - p1.y/height)*255, 
              p1.y/height*255,dist1);

        line(p1.x, p1.y, p2.x, p2.y)
        
        strokeWeight(Math.floor(dist1/20)-3)
        stroke(0,dist1);
        line(p1.x, p1.y, p2.x, p2.y)
        pop()
      }
    }
  }
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }

};

function mousePressed(){
    system.addParticle1(createVector(mouseX, mouseY));
}