// import * as ship from "./ship.js";
// import * as bullet from "./bullet.js"

let Ship
let BulletSystem
let ShapeSystem
let Scene
let expbar
let mouseDegree
let cnv, pg
let gameOver = false
let isStart = false
let font_AW
let score = 0
let level = 0

let SH_time;
let BU_time;

let scoreTEXT = document.getElementById("score");
let healthTEXT = document.getElementById("health");
let shieldTEXT = document.getElementById("shield");

function preload() {
    font_AW = loadFont('src/font/Audiowide/Audiowide-Regular.ttf');
}


function setup() {
    cnv = createCanvas(windowWidth, windowHeight);
    pg = createGraphics(windowWidth, windowHeight);
    imageMode(CENTER);
    rectMode(CENTER);
    // !!!!!!!!!!!!!!!
    frameRate(60)
    Ship = new ship();
    BulletSystem = new bulletSystem();
    ShapeSystem = new shapeSystem();
    Scene = new scene();
    expbar = new ProgressBar(width / 2 - 200, height - 50, 400, 10, 10);

    SH_timer = frameRate*5;
    BU_timer = frameRate*2;
}

function fontShake(txt, size, color, posX, posY) {
    let shakeX = random(-2, 2);
    let shakeY = random(-2, 2);
    noStroke()
    textAlign(CENTER, CENTER);
    textSize(size);
    textFont(font_AW);
    fill('rgba(${color}, 0.25)');
    for (let i = 0; i < 5; i++) {
        let offset = i * 2;
        fill(`rgba(${color}, ${0.05 * (5 - i)})`);
        text(txt, posX + shakeX + offset, posY - 100 + shakeY + offset);
    }

    fill(`rgba(${color}, 0.25)`);
    text(txt, posX + shakeX, posY - 100 + shakeY);
}


function draw() {
    if (gameOver) {
        background(25, 25, 25, 10);
        fontShake("- Game Over -", 100, [232, 221, 63], windowWidth / 2, windowHeight / 2);
        textSize(30);
        text(`> score = ${score} <`, windowWidth / 2, windowHeight / 2 + 200);
        return;
    }
    if (!isStart) {
        cnv.mouseClicked(() => { isStart = true });
        background(50);
        fontShake("- Shape Shooter -", 100, [232, 221, 63], windowWidth / 2, windowHeight / 2);
        fontShake("> click anywhere <", 40, [3, 252, 223], windowWidth / 2, windowHeight / 2 + 200);
        return;
    }
    scoreTEXT.style.display = "flex";
    healthTEXT.style.display = "flex";
    shieldTEXT.style.display = "flex";
    // =====
    // =====
    textSize(12)
    textAlign(LEFT, CENTER)
    background(25, 25, 25);
    let dx = mouseX - windowWidth / 2;
    let dy = mouseY - windowHeight / 2;
    Scene.move(calcMove(degrees(atan2(dx, dy))));
    mouseDegree = degrees(atan2(dx, dy))
    // ========================
    // expbar.update();
    expbar.display();
    Ship.update();
    ShapeSystem.update();
    BulletSystem.update();
    if (frameCount % 10 == 0) {
        ShapeSystem.createShapes();
        scoreTEXT.innerHTML = `Score: ${score.toFixed(2)}`;
        healthTEXT.innerHTML = `Health: ${Ship.health}`;
        shieldTEXT.innerHTML = `Shield: ${Ship.shield}`;
    }
    if (score - level * 500 > 500) {
        Ship.health += 10;
        Ship.damage += 8;
        level++;
    }
    detectShip();
    detectBullet();
}

function die() {
    console.log("YOU DIED !")
    gameOver = true;
    isStart = false;
}

// =======================================

// function keyPressed() {
//     if (key == "w") {
//         Ship.isMove = true;
//         let dx = mouseX - windowWidth / 2;
//         let dy = mouseY - windowHeight / 2;
//         // text(degrees(atan2(dx, dy)));
//     }
//     if (key === " ") {
//         Ship.shot();
//     }
// }
// function keyReleased() {
//     if (key == "w") {
//         Ship.isMove = false;
//     }
// }
// ========================================
function calcMove(degree) {
    let disToMid = Math.sqrt(Math.pow(Math.abs(mouseX - windowWidth / 2), 2) + Math.pow(Math.abs(mouseY - windowHeight / 2), 2), 2);
    if (disToMid < 50) {
        return createVector(0, 0);
    }
    let x, y
    stroke(255, 255, 255)
    strokeWeight(0)
    fill(255, 255, 255);
    // text("mouseDegree: " + degree.toFixed(1), 20, 40);
    if (degree > 0 && degree <= 90) {
        y = (- (degree - 90)) / 90 * Ship.speed;
        x = degree / 90 * Ship.speed;
        // text(`velx = ${x.toFixed(2)}`, 20, 20)
        // text(`vely = ${y.toFixed(2)}`, 20, 30)
    } else if (degree > 90 && degree <= 180) {
        y = (- (degree - 90)) / 90 * Ship.speed;
        x = ((180 - degree)) / 90 * Ship.speed;
        // text(`velx = ${x.toFixed(2)}`, 20, 20)
        // text(`vely = ${y.toFixed(2)}`, 20, 30)
    } else if (degree > -180 && degree <= -90) {
        y = (degree + 90) / 90 * Ship.speed;
        x = (- (degree + 180)) / 90 * Ship.speed;
        // text(`velx = ${x.toFixed(2)}`, 20, 20)
        // text(`vely = ${y.toFixed(2)}`, 20, 30)
    } else if (degree > -90 && degree <= 0) {
        y = (degree + 90) / 90 * Ship.speed;
        x = degree / 90 * Ship.speed;
        // text(`velx = ${x.toFixed(2)}`, 20, 20)
        // text(`vely = ${y.toFixed(2)}`, 20, 30)
    }
    return createVector(x, y);
    // debug
    return [0, 0]
}
