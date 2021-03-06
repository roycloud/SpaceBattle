var bonusBoxGreen, bonusBoxBlue, bonusStats, scoreBoard, airCraft, shield, aliens,
    laser, explosion, speed1, speed2, timedEvents, background0, background1,
    reset, innerW, innerH, soundLaser, soundExplosion, backgroudMusic;
/****************
GAME START CALLOUT: Calls for the canvas and canvas elements functions
this is the function to be calgitled to start the game
****************/
function startGame(){
  aliens = [];
  laser = [];
  bonusStats = {single: true, dual: false, blast:false, shield: false};
  timedEvents = {playerLives: 0, callPlayerLiveStatus: false, bulletTime: false,
    bossShotsCount: 0, scoreCount: 0, resetButton: false, difficulty: 7, // cannot be less than 2
    explosionEffect: false, speedEffect: 0, timeElapsed: 0, speedCreate: false}
  innerH = window.innerHeight;
  innerW = window.innerWidth;
  // Component(width, Height, Color or Imange, x, y, type)
  background0 = new Component(innerW, innerH, "../images/background.jpg", 0,0, "image");
  background1 = new Component(innerW, innerH, "../images/background.jpg", 0,-innerH, "image");
  airCraft = new Component(60, 60, "../images/AirCraft.png", innerW/2, innerH/2, "image");
  for(var i = 0; i <= timedEvents.difficulty-2; i++){
    aliens[i] = new Component(60, 60, "../images/AlienShip.png", (i*100+100), -70, "image");
  }
  for(var i = 0; i <= timedEvents.difficulty; i++){
    laser[i] = new Component(0, 0, "../images/laserRed01.png", -50, -50, "image");
  }
  reset = new Component(100, 50, "../images/Button.png", (innerW/2-50), innerH-200, "image");
  scoreBoard = new Component(80, 30, "gray", (innerW/2 - innerW/3), (innerH - 100), "text");
  bonusBoxGreen = new Component(30, 30, "../images/powerupGreen_bolt.png", 70, -40, "image");
  bonusBoxBlue = new Component(30, 30, "../images/powerupBlue_bolt.png", 70, -40, "image");
  explosion = new Component(0, 0, "../images/spaceEffects_017.png", 0, 0, "image");
  speed2 = new Component(20, 40, "../images/fire01.png", 0, 0, "image");
  speed1 = new Component(20, 40, "../images/fire01.png", 0, 0, "image");
  shield = new Component(0, 0, "../images/shield1.png", 0, 0, "image");
  soundLaser = new Audio("../sounds/slimeball.wav");
  soundExplosion = new Audio("../sounds/explode.wav");
  backgroudMusic = new Audio("../sounds/Lines-of-Code.wav");
  timedEvents.playerLives = 3;
  myGameArea.start();
}
/****************
CANVAS: Create canvas, added event listener and frame rate function call, stop or reset
****************/
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = innerW - 20;
    this.canvas.height = innerH - 20;
    this.context = this.canvas.getContext("2d");
    this.canvas.style.cursor = "none";
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    document.addEventListener('keypress', (event) => {
      if (event.charCode == 32) {
        timedEvents.bulletTime = true;
      }
    });
    this.interval = setInterval(updateGameArea, 20);
    if (!timedEvents.resetButton){
      backgroudMusic.play();
    }
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function(){
    backgroudMusic.pause();
    reset.create();
    timedEvents.resetButton = true;
    this.canvas.style.cursor = "";
    clearInterval(this.interval);
  },
  gameEvents: function(){
    //should be set to show a miniBoss every 70 points
    if (timedEvents.bossShotsCount == 20) {
      timedEvents.bossShotsCount++;
      return false;
    } else if (timedEvents.bossShotsCount == 41) {
      return false;
    } else if (timedEvents.scoreCount >= 60 && (aliens[aliens.length-1].y +
        aliens[aliens.length-1].height) <= innerH) {
        return true;
    } else if (timedEvents.scoreCount >= 20 && (aliens[aliens.length-1].y +
        aliens[aliens.length-1].height) <= innerH
        && timedEvents.bossShotsCount <= 20) {
      return true;
    } else {
        return false;
    }
  },
  playerLiveStatus: function(timeCheckout) {
    timedEvents.timeElapsed = timeCheckout;
    timedEvents.playerLives--;
    if (timedEvents.playerLives == 0) {
      myGameArea.stop();
      bonusStats.single = true;
      bonusStats.dual = false;
      bonusStats.blast = false;
    }
    timedEvents.callPlayerLiveStatus = false;
  },
  collisionTimeOut: function() {
    if ((Date.now() - timedEvents.timeElapsed) >= 5000) timedEvents.callPlayerLiveStatus = true;
  }
}
/****************
COMPONENTS CONSTRUCTOR: this where all canvas elements are created
****************/
function Component(width, height, c, x, y, type){
  this.type = type;
  if(type == "image"){
    this.image = new Image();
    this.image.src = c;
  }
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.create = function() {
    ctx = myGameArea.context;
    if(type === "image"){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else if(type === "text"){
        ctx.font = "15px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Score "+timedEvents.scoreCount,this.x, this.y);
        ctx.fillText("Lives "+timedEvents.playerLives,this.x, this.y+30);
      }
  }

  /****** Player logic *****/
  this.playerLaserMotion = function(type) {
    if(timedEvents.bulletTime && (this.y >= 0)){
      this.y >= (airCraft.y - 10) ? (soundLaser.currentTime = 0,
        soundLaser.play()): NaN;
      this.y-= 38;
      this.width = 10;
      this.height = 40;
    } else {
      if((type === "single") && bonusStats.single){
        this.image.src = "../images/laserRed01.png";
        this.x = airCraft.x - 5 + airCraft.width/2;
        this.y = airCraft.y - 5;
        timedEvents.bulletTime = false;
      } else if((type === "dual") && bonusStats.dual){
        this.image.src = "../images/laserGreen11.png";
        this.x = airCraft.x + 43;
        this.y = airCraft.y + 25;
        timedEvents.bulletTime = false;
      } else if((type === "single") && bonusStats.dual){
        this.image.src = "../images/laserGreen11.png";
        this.x = airCraft.x + 9;
        this.y = airCraft.y + 25;
        timedEvents.bulletTime = false;
      } else if((type === "single") && bonusStats.blast){
        this.image.src = "../images/laserBlue15.png";
        this.x = airCraft.x - 5 + airCraft.width/2;
        this.y = airCraft.y - 5;
        timedEvents.bulletTime = false;
      } else if((type === "dual") && bonusStats.blast){
        this.image.src = "../images/laserBlue15.png";
        this.x = airCraft.x + 9;
        this.y = airCraft.y + 25;
        timedEvents.bulletTime = false;
      } else if((type === "blast") && bonusStats.blast){
        this.image.src = "../images/laserBlue15.png";
        this.x = airCraft.x + 43;
        this.y = airCraft.y + 25;
        timedEvents.bulletTime = false;
      }
      timedEvents.bulletTime = false;
      this.width = 0;
      this.height = 0;
    }
  }
  this.speedEffect = function(mode){
    if(mode === "left"){
      this.x = airCraft.x + 3;
      this.y = airCraft.y + airCraft.height;
    }else if(mode === "right"){
      this.x = airCraft.x + 37;
      this.y = airCraft.y + airCraft.height;
    }
  }
  this.shieldActive = function() {
    if (!timedEvents.callPlayerLiveStatus) {
      this.width = this.height = 80;
      this.x = airCraft.x - 10;
      this.y = airCraft.y - 10;
    }
    else this.width = this.height = 0;
  }
  /****** Enemies logic *****/
  this.alienLaserMotion = function(alienLaser){
    if(this.y >= -40 && alienLaser.y <= (this.y + innerH)){
      alienLaser.y += 5;
      alienLaser.width = 20;
      alienLaser.height = 20;
      alienLaser.image.src = "../images/laserBlue10.png";
    } else {
      alienLaser.x = this.x + this.width/3;
      alienLaser.y = this.y + this.height;
      alienLaser.width = 0;
      alienLaser.height = 0;
    }
  }
  this.alienHit = function(mode) {
    if(mode === "bossStart"){
      explosion.width = explosion.height = 100;
      explosion.x = this.x;
      explosion.y = this.y;
      timedEvents.explosionEffect = true;
      if (timedEvents.bossShotsCount % 2 == 0) this.x += 30;
      else if (timedEvents.bossShotsCount % 5 == 0) this.x -= 25;
      else if (timedEvents.bossShotsCount <= 5) this.x += 20;
      else if (timedEvents.bossShotsCount >= 8) this.x -= 30;
      // this.y++;
    }else if(mode === "alien"){
      explosion.width = explosion.height = 70;
      explosion.x = this.x;
      explosion.y = this.y;
      timedEvents.explosionEffect = true;
      soundExplosion.currentTime = 0;
      soundExplosion.play();
      this.x = Math.floor(Math.random()*(innerW*0.8)+10);
      this.y = -40;
    }else if(mode === "bossEnd"){
      this.y = -100;
      this.width = this.height = 0;
    }
  }
  this.alienMotion = function(mode){
    if((this.y >= innerH) && (mode === "bossStart")){
      myGameArea.stop();
    }else if((this.y >= innerH) && (mode === "alien")){
      timedEvents.scoreCount--;
      this.alienHit(mode);
    }else if((this.y <= innerH) && (mode === "bossStart")){
      this.width = 100;
      this.height = 100;
      this.image.src = "../images/ship4_mod.png";
      this.y ++;
      if(this.y == -90){this.x = Math.floor(Math.random()*(innerW*0.8)+5)}
    }else if(mode === "explosion"){
      var imgSrc = ["../images/spaceEffects_012.png", "../images/spaceEffects_017.png"];
      this.image.src = imgSrc[Math.floor(Math.random()*2)];
      this.width <= 0 ? timedEvents.explosionEffect = false:
      (this.width-=2,this.height-=2);
    }else{
      this.y++;
    }
  }

  /****** Generic game logic *****/
  this.looping = function(obj){
    this.y+=2;
    obj.y+=2;
    if(this.y >= 0){
      this.y = -innerH;
      obj.y = 0;
    }
  }
  this.boxShow = function(){
    if(((timedEvents.scoreCount >= 20 && timedEvents.scoreCount <= 50) &&
    bonusStats.single)
    || ((timedEvents.scoreCount >= 50 && timedEvents.scoreCount <= 90) &&
    bonusStats.dual)){
      if(this.y <= innerH+this.height){
        this.y == -30 ? this.x = Math.floor(Math.random()*(innerW*0.8)+5) :
        NaN;
        this.y++;
      }else{
        this.y = -40;
      }
    }else{
      this.y = -40;
    }
  }
  this.collision = function(obj) {
      var objBott = obj.y + obj.height;
      var objLeft = obj.x;
      var objRight = obj.x + obj.width - 10;
      var objTop = obj.y;
      var thisBott = this.y + this.height;
      var thisLeft = this.x;
      var thisRight = this.x + this.width - 10;
      var thisTop = this.y;
      if((((objTop <= thisBott && objTop >= thisTop)
      || (objBott >= thisTop && objBott <= thisBott))
      && (objLeft <= thisRight && objRight >= thisLeft))){
        return true;
      } else {
        return false;
      }
  }
}
/****************
GAME AREA UPDATE: setInterval function
****************/
function updateGameArea() {
  if (aliens.some(x => {return airCraft.collision(x)})) {
    if (timedEvents.callPlayerLiveStatus) myGameArea.playerLiveStatus(Date.now());
  }
  myGameArea.clear();
  myGameArea.collisionTimeOut();
  background0.create();
  background1.create();
  background1.looping(background0);
  airCraft.create();
  scoreBoard.create();
  explosion.create();
  airCraft.y < timedEvents.speedEffect ? (timedEvents.speedCreate = true,
          speed1.speedEffect("left"),speed2.speedEffect("right")):
          (timedEvents.speedCreate = false);
        timedEvents.speedEffect = airCraft.y;
  if(timedEvents.speedCreate){speed1.create();speed2.create();}
  if(bonusBoxGreen.collision(airCraft)){
    bonusStats.dual = true;
    bonusStats.single = false;
    bonusStats.blast = false;
    bonusBoxGreen.boxShow();
  }else if(bonusBoxBlue.collision(airCraft)){
    bonusStats.dual = false;
    bonusStats.single = false;
    bonusStats.blast = true;
    bonusBoxBlue.boxShow();
  }
  if(bonusStats.single){
    bonusBoxGreen.create();
    bonusBoxGreen.boxShow();
    laser[laser.length-3].create();
    laser[laser.length-3].playerLaserMotion("single");
  } else if(bonusStats.dual){
    bonusBoxBlue.create();
    bonusBoxBlue.boxShow();
    laser[laser.length-3].create();
    laser[laser.length-3].playerLaserMotion("single");
    laser[laser.length-2].create();
    laser[laser.length-2].playerLaserMotion("dual");
  }else if(bonusStats.blast){
    laser[laser.length-3].create();
    laser[laser.length-3].playerLaserMotion("single");
    laser[laser.length-2].create();
    laser[laser.length-2].playerLaserMotion("dual");
    laser[laser.length-1].create();
    laser[laser.length-1].playerLaserMotion("blast");
  }
  if(myGameArea.gameEvents() == true){
    aliens[aliens.length-1].create();
    aliens[aliens.length-1].alienMotion("bossStart");
  }else if(myGameArea.gameEvents() == false){
    aliens[aliens.length-1].alienHit("bossEnd");
    if(timedEvents.explosionEffect) explosion.alienMotion("explosion");
  }
  for(var i = 0; i <= aliens.length-2; i++){
      aliens[i].create();
      aliens[i].alienMotion("alien");
      // aliens laser create for the remaining indexes of laser array
      if(i < laser.length-3){
        laser[i].create();
        aliens[i].alienLaserMotion(laser[i]);
        if (airCraft.collision(laser[i]) == true) {
          // myGameArea.stop();
          if (timedEvents.callPlayerLiveStatus) myGameArea.playerLiveStatus(Date.now());
        }
      }
      if(laser[laser.length-3].collision(aliens[i]) && timedEvents.bulletTime){
        timedEvents.bulletTime = false;
        timedEvents.scoreCount++;
        aliens[i].alienHit("alien");
      }
      if(laser[laser.length-2].collision(aliens[i]) && timedEvents.bulletTime){
        timedEvents.bulletTime = false;
        timedEvents.scoreCount++;
        aliens[i].alienHit("alien");
      }
      if(laser[laser.length-1].collision(aliens[i]) && timedEvents.bulletTime){
        timedEvents.bulletTime = false;
        timedEvents.scoreCount++;
        aliens[i].alienHit("alien");
      }
  }
  if(timedEvents.explosionEffect) explosion.alienMotion("explosion");
  // boss collision detection
  if((laser.some((y) => { return y.collision(aliens[aliens.length-1])}))
  && timedEvents.bulletTime && myGameArea.gameEvents()){
    timedEvents.bulletTime = false;
    timedEvents.bossShotsCount++;
    aliens[aliens.length-1].alienHit("bossStart");
  }
  // }

  shield.create();
  shield.shieldActive();
}

/****** Event Listeners *****/
// buttons detection
document.addEventListener('click', (event) => {
  var buttonBott = reset.x + reset.width;
  var buttonSide = reset.y + reset.height;
  if((event.clientX >= reset.x && event.clientX <= buttonBott)
    && (event.clientY <= buttonSide && event.clientY >= reset.y)
    && timedEvents.resetButton){
    startGame();
  }
});
// buttons detection Player aircraft movement
document.addEventListener('mousemove', (event) =>{
  airCraft.x = event.pageX;
  airCraft.y = event.pageY;
});
startGame();
