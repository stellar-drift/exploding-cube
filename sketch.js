let cnv;
let exploded = false;
let returning = false;
let reforming = false;
let stars = [];
let boxSize = 0;
let returnSpeed = 0;
let popSound;


function setup() {  // set up & configure once at the beginning
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);  // create canvas, enable WebGL for 3D rendering
  centerCanvas();

  camera(  // custom camera angle
    600, -600, 600,  // camera position (x, y, z)
    0, 0, 0,  // look at the center (center is 0,0,0)
    0, 1, 0  // which direction is "up"
  );  
}


function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    centerCanvas(); // re-ceenter after resize
}


function preload() {
    popSound = loadSound('shine_sound.mp3'); 
}


function draw() {  // loop the function body every frame using draw()
  background('#0f2a0f');  // set bacground color 
  orbitControl(1, 1, 0);  // enable orbiting with the mouse 
  ambientLight(255);  // even lighting
  stroke('#b60059');  // set the stroke color
  strokeWeight(8);  // set the stroke thickness
  
  
  if (!exploded && !reforming) {  // draw the large box here
    push(); // save current drawing state
    ambientMaterial('#f5c000');  // apply color to box object
    box(200, 200);  // draw the box shape
    pop(); // go back to previous state
  } 
  else if(!reforming) {  // draw and update small boxes
    let allReturned = true;
    
    if (returning) {
      returnSpeed += 0.05;   // acceleration once per frame
      returnSpeed =  constrain(returnSpeed, 0, 10);   // limit max speed to 10
    }
    
    for (let b of stars) {
      // draw the lines
      push();
      stroke('#f5c000');
      strokeWeight(0.3);
      line(0, 0, 0, b.pos.x, b.pos.y, b.pos.z);
      pop();
      
      // draw the stars
      push();  // save current drawing state
      ambientMaterial('#f5c000');
      strokeWeight(1);
      translate(b.pos.x, b.pos.y, b.pos.z);
      rotateX(b.angle);
      rotateZ(b.angle);
      drawStar(5, 15);  // draw stars 
      pop();  // go back to previous state
      
      if (!returning) {
        b.pos.add(b.vel); // move outward
      }
      else {
        let toCenter = p5.Vector.sub(createVector(0, 0, 0), b.pos);
        let stepMag = min(returnSpeed, toCenter.mag());  // clamp step so it doesn't overshoot
        let step = toCenter.copy().setMag(returnSpeed);
        b.pos.add(step);
        
        if (toCenter.mag() > 10) {
          allReturned = false;  // not done returning 
        }
      }
      
      b.angle += b.spinSpeed;   // update rotation angle
    }
    
    if (returning && allReturned && !reforming){
      returning = false;
      reforming = true;
      boxSize = 0;  // start growing from 0
    }
  }
    
  if (reforming) {
    push();
    ambientMaterial('#f5c000');
    box(boxSize);   // growing box
    pop();
      
    boxSize += 1;   // adjust speed as needed
      
    if (boxSize >= 200) {
      boxSize = 200;
      reforming = false;
      exploded = false;
      stars = [];
    }
  }
}


function mouseReleased() {
  if (!exploded && !reforming) {
    exploded = true;
    console.log("BOOM!!");  // record to console
    generateStars();  // call fxn
    popSound.setVolume(0.5); 
    popSound.play();    // play sound loaded earlier
    setTimeout(() => {
      returning = true;
      returnSpeed = 0;  // reset speed for return animation
     }, 3000); // start returning after 3 seconds
  }
}


function generateStars() {
  stars = [];  // create empty array
  let numBoxes = 50;   // set number of boxes
  
  for (let i = 0; i < numBoxes; i++) {
    let pos = createVector(0, 0, 0);  // start at center
    let vel = p5.Vector.random3D().mult(random(5, 10));   // random direction
    let angle = random(TWO_PI);   // each star's starting rotation
    let spinSpeed = random(-0.05, 0.05);   // each star's spin speed
    stars.push({ pos, vel, angle, spinSpeed });   // add new elements to stars array using push()
  }
}


function drawStar(radius1, radius2, npoints = 6) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle){
    let sx = cos(a) * radius2;
    let sy = sin(a) * radius2;
    vertex(sx, sy);
    sx = cos(a + halfAngle) * radius1;
    sy = sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

