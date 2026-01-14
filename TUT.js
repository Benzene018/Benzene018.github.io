let x;
let y; 
const speed = 20;
const rectSpeed = 20;
let gifImg; 
let backgroundImgs = []; 
let currentBgIndex;
let moveSound;
let eatSound;
let bgMusic;
const imgW = 50; 
const imgH = 100; 

let circleX;
let circleY; 
const circleSize = 25; 
let currentSize; 
let scaleSpeed = 0.5; 
const minSize = 10; 

const totalTime = 60; //倒计时
const refreshTime = 60; 
const refreshFrame = refreshTime * 60; 

let remainingTime = totalTime; 
let score = 0; // 小虫得分
let rectScore = 0; // 图片得分 
let win = 8; // 目标得分
const addTime = 40; 
const addScore = 5;

let rectX, rectY;   
let rectW, rectH;   
let stingImg;
let imgRotate = 0;

let gameStart = false;
let isDragging = false; 
let dragOffsetX;
let dragOffsetY; //优化拖动效果
let gameOver = false; 
let Win = false; 

function preload() {
  gifImg = loadImage('2240620F5219FD474EA9895B3547BD6B.gif'); 
  backgroundImgs[0] = loadImage('WhitePalace.jpg');
  backgroundImgs[1] = loadImage('FIGUE.webp');
  backgroundImgs[2] = loadImage('Ancient_Basin.webp');
  backgroundImgs[3] = loadImage('Crystal_Peak.webp'); 
  stingImg = loadImage('STING.png');
  
  bgMusic = loadSound('WhitePalace.mp3');
  moveSound = loadSound('move.mp3');
  eatSound = loadSound('eat.mp3');
}

function setup() {
  createCanvas(600, 400);
  x = width / 2;
  y = height / 2;
  Drawcircle();     
  DrawRec();  
  bgMusic.setVolume(0.1); 
  moveSound.setVolume(0.2);
  eatSound.setVolume(0.2);
  currentBgIndex = floor(random(backgroundImgs.length));
}

function keyPressed() {
  if(!gameStart || gameOver || Win) return; 

 
  if(keyCode === 87) { 
    rectY = constrain(rectY - rectSpeed, 0, height - rectH);
    imgRotate = 0; 
  }
  if(keyCode === 83) { 
    rectY = constrain(rectY + rectSpeed, 0, height - rectH);
    imgRotate = 180; 
  }
  if(keyCode === 65) { 
    rectX = constrain(rectX - rectSpeed, 0, width - rectW);
    imgRotate = -90; 
  }
  if(keyCode === 68) { 
    rectX = constrain(rectX + rectSpeed, 0, width - rectW);
    imgRotate = 90; 
  }

  if(keyCode === 87 || keyCode === 83 || keyCode === 65 || keyCode === 68) {
    event.preventDefault();
  }

  // 小虫移动
  if (keyCode === UP_ARROW && y > 0) {
    y -= speed;
    moveSound.stop(); 
    moveSound.play();
  }
  if (keyCode === DOWN_ARROW && y < height - imgH) {
    y += speed;
    moveSound.stop(); 
    moveSound.play();
  }
  if (keyCode === LEFT_ARROW && x > 0) {
    x -= speed;
    moveSound.stop(); 
    moveSound.play();
  }
  if (keyCode === RIGHT_ARROW && x < width - imgW) {
    x += speed;
    moveSound.stop(); 
    moveSound.play();
  }
}

function Drawcircle() {
  circleX = random(circleSize/2, width - circleSize/2);
  circleY = random(circleSize/2, height - circleSize/2);//生成小球
  currentSize = circleSize; 
  scaleSpeed = 0.5;
}

function DrawRec() {
  rectW = random(100, 200);  
  rectH = random(50, 150);   
  rectX = random(0, width - rectW);
  rectY = random(0, height - rectH);  
  isDragging = false; 
  imgRotate = 0; 
}

function draw() {
  image(backgroundImgs[currentBgIndex], 0, 0, width, height);

  let imgLeft = x;
  let imgRight = x + imgW;
  let imgTop = y;
  let imgBottom = y + imgH;
  
  let circleLeft = circleX - currentSize/2;
  let circleRight = circleX + currentSize/2;
  let circleTop = circleY - currentSize/2;
  let circleBottom = circleY + currentSize/2;

  // 图片碰撞边界
  let rectLeft = rectX;
  let rectRight = rectX + rectW;
  let rectTop = rectY;
  let rectBottom = rectY + rectH;

  // 小球呼吸感
  currentSize += scaleSpeed; 
  if(currentSize <= minSize){
    scaleSpeed = abs(scaleSpeed);
  }
  else if(currentSize >= circleSize){
    scaleSpeed = -abs(scaleSpeed); 
  }

  if(!gameOver && !Win){
    if(gameStart){
      // 倒计时
      if(frameCount % 60 === 0 && remainingTime > 0){
        remainingTime --;  
      }
      if(remainingTime <= 0){
        gameOver = true;
        remainingTime = 0;
        isDragging = false;
      }
      
      if(imgRight > circleLeft && imgLeft < circleRight && imgBottom > circleTop && imgTop < circleBottom){
          score += 1;    
          eatSound.stop();
          eatSound.play(); 
          if(score >= win || rectScore >= win){
            Win = true;
            gameOver = true;
            isDragging = false;
          }
          Drawcircle();  // 刷新小球
          DrawRec();     // 刷新图片
      }

      if(rectRight > circleLeft && rectLeft < circleRight && rectBottom > circleTop && rectTop < circleBottom){
          rectScore += 1; // 地刺得分+1
          eatSound.stop();
          eatSound.play();
          if(score >= win || rectScore >= win){
            Win = true;
            gameOver = true;
            isDragging = false;
          }
          Drawcircle(); // 只刷新小球
      }

      // 刷新
      if (frameCount % refreshFrame === 0) {
        Drawcircle(); 
      }

      // 碰撞
      if(imgRight > rectLeft && imgLeft < rectRight && imgBottom > rectTop && imgTop < rectBottom){
          x = width / 2;  
          y = height / 2; 
      } 
    }
    // 鼠标拖拽地刺
    if(gameStart && isDragging){
        let newRectX = mouseX - dragOffsetX;
        let newRectY = mouseY - dragOffsetY;
        newRectX = constrain(newRectX, 0, width - rectW);
        newRectY = constrain(newRectY, 0, height - rectH);
        rectX = newRectX;
        rectY = newRectY;
      }
      fill(255);
      noStroke();
      rect(80, height - 50, 440, 50,10);
      rect(width/2 - 60, 3, 120, 30, 20);//底色
  }

  // 得分显示
  fill(0);        
  textSize(15);   
  text(`小虫得分：${score}  图片得分：${rectScore}  目标得分：${win}`, width/2, height - 20);
  text('方向键移小虫,WASD使用地刺', width/2, height - 45);
  textAlign(CENTER, TOP); 
  let minutes = floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  let timeText = `${nf(minutes,2)}:${nf(seconds,2)}`;
  text(timeText, width/2, 10); 

  // 裁剪图片+中心旋转绘制
  if(stingImg){
    let imgOrgW = stingImg.width;
    let imgOrgH = stingImg.height;
    let imgRatio = imgOrgW / imgOrgH;
    let showRatio = rectW / rectH;
    let cropW, cropH, cropX, cropY;
    if(showRatio > imgRatio){
      cropH = imgOrgH;
      cropW = imgOrgH * showRatio;
      cropX = (imgOrgW - cropW) / 2;
      cropY = 0;
    } else {
      cropW = imgOrgW;
      cropH = imgOrgW / showRatio;
      cropX = 0;
      cropY = (imgOrgH - cropH) / 2;
    }
    // 画布状态保护 + 中心旋转核心逻辑
    push(); 
    translate(rectX + rectW/2, rectY + rectH/2); 
    rotate(radians(imgRotate)); 
    image(stingImg, -rectW/2, -rectH/2, rectW, rectH, cropX, cropY, cropW, cropH);
    pop(); 
  }

  fill(random(255), random(255), random(255)); 
  ellipse(circleX, circleY, currentSize); // 小球
  image(gifImg, x, y, imgW, imgH);//小虫

  if(Win){
    fill(0);
    rect(160, 40 , 290 ,90,40);
    fill(255, 100, 0);
    textSize(20); 
    textFont('aLIBABA-PuHuiTi-Heavy');
    text("按【空格键】开启下一局", width/2, 50);
    text("恭喜通关！有人达标啦", width/2, 100); 
  }
  else if(gameOver){
     fill(255);
    rect(width/2-50, height/2-10 , 100 ,40,40);
    fill(255, 0, 0); 
    textFont('aLIBABA-PuHuiTi-Heavy');
    textSize(20); 
    text("游戏结束", width/2,	height/2); 
  }

  if(!gameStart){
    fill(255, 230); 
    rect(150, 150, 300, 80, 20); 
    fill(0);
    textSize(24);
    textStyle(BOLD);
    text("点击屏幕开始游戏", width/2, 190);
    textStyle(NORMAL);
  }
}

function mouseReleased() { isDragging = false; }
function mouseOut() { isDragging = false; } 

function mouseClicked() {
  if(!gameStart){
    gameStart = true;
    if(!bgMusic.isPlaying()){
      bgMusic.loop(); 
    }
    return;
  }
  if((gameOver || Win) && !bgMusic.isPlaying()){
    bgMusic.loop();
  }
}

function mousePressed() {
 if(!gameStart || gameOver || Win) return; 
  if(mouseX > rectX && mouseX < rectX + rectW && mouseY > rectY && mouseY < rectY + rectH){
    isDragging = true;
    dragOffsetX = mouseX - rectX;
    dragOffsetY = mouseY - rectY;
  }
}

function keyReleased() {
  if(Win && keyCode === 32){
    win += addScore;       
    remainingTime += addTime; 
    currentBgIndex = floor(random(backgroundImgs.length));

    Win = false;
    gameOver = false;
    x = width / 2;
    y = height / 2;
    Drawcircle();
    DrawRec();
    isDragging = false;
  }
}