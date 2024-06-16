let Ship, Bullet, BulletSystem, Shape, ShapeSystem;
let particles = [];
// last tick of shape generate
let lastShapeTime = 0;
let isGameOver = false;
let score = 0;
let trail = [];
let prePsr;

// ==============================================

function setup() {
	// environmnt setting
	angleMode(DEGREES);
	rectMode(CENTER);
	textAlign(CENTER, CENTER);
	// generate scene
	createCanvas(600, 600);
	prePsr = createGraphics(600, 600);

	//instantiate
	Ship = new ship();
	BulletSystem = new bulletSystem();
	ShapeSystem = new shapeSystem();
	for (let i = 0; i < 5; i++) {
		particles.push(new Particle(random(width), random(height)));
	}
}

function draw() {
	if (isGameOver) {
		background(100, 50);
		fill(255, 0, 0);
		textSize(64);
		drawBlurredText("GAME OVER", 300, 300, 5);
		textSize(28);
		drawBlurredText(`Score: ${score}`, 300, 360, 1);
		return 0;
	}
	background(0);
	Ship.render();
	Ship.update();
	BulletSystem.update();
	ShapeSystem.update();

	let currentTime = millis();
	if (currentTime - lastShapeTime > random(500, 1000)) {
		ShapeSystem.add();
		lastShapeTime = currentTime;
	}
	for (let i = 0; i < particles.length; i++) {
		particles[i].update(Ship.pos.x, Ship.pos.y);
		particles[i].display();
		drawGradientCircle(
			particles[i].position.x,
			particles[i].position.y,
			particles[i].size * 2
		);
	}
}

function drawBlurredText(txt, x, y, blurAmount) {
	for (let i = 0; i < blurAmount; i++) {
		fill(255, 100 - i * 20);
		text(txt, x + random(-3, 3), y + random(-3, 3));
	}
	fill(255);
}

// ==============================================

class ship {
	constructor() {
		this.pos = createVector(width / 2, height / 2);
		this.rotation = -90;
		this.speed = 2.5;
		this.vel = createVector(cos(this.rotation), sin(this.rotation)).mult(
			this.speed
		);
		this.health = 10;
		this.shield = 10;
		this.isMove = false;
		this.isRotate = 0;
		this.cooldown = false;
	}

	render() {
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.rotation + 90);
		fill("#fe637a");
		triangle(-12, 10, 0, -35, 12, 10);
		fill("#41637a");
		triangle(-10, 10, 0, -30, 10, 10);

		fill("#4cc3e0");
		triangle(-15, 10, -10, -15, -5, 10);

		fill("#4cc3e0");
		triangle(15, 10, 10, -15, 5, 10);
		pop();
		// if (trail.length > 0) {
		// noFill();
		// stroke("#fe637a");
		// beginShape();
		// for (let i = 0; i < trail.length; i++) {
		// vertex(trail[i].x, trail[i].y);
		// }
		// endShape();
		// }
		// trail.push(createVector(this.pos.x, this.pos.y));
		// if (trail.length > 50) {
		// trail.splice(0, 1);
		// }
	}

	update() {
		this.move();
		this.rotate();
		this.hitDetection();
	}

	move(x, y) {
		this.pos.add(x, y);
		if (this.isMove) {
			this.pos.add(this.vel);
		}
	}

	rotate(direction) {
		this.vel = createVector(cos(this.rotation), sin(this.rotation)).mult(
			this.speed
		);
		if (this.isRotate == 1) {
			this.rotation -= 3;
		} else if (this.isRotate == 2) {
			this.rotation += 3;
		}
	}

	shoot() {
		if (!this.cooldown) {
			BulletSystem.add(this.pos.copy(), this.rotation);
		}
	}

	hitDetection() {
		for (let k = 0; k < ShapeSystem.shapes.length; k++) {
			let dis = dist(
				this.pos.x,
				this.pos.y,
				ShapeSystem.shapes[k].pos.x,
				ShapeSystem.shapes[k].pos.y
			);
			if (dis < 25) {
				ShapeSystem.shapes[k].changeHealth(-100);
				this.health -= 3;
				if (this.health <= 0) {
					isGameOver = true;
				}
			}
		}
	}
}

class bullet {
	constructor(pos, heading, speed, damage) {
		this.pos = pos;
		this.heading = heading;
		this.speed = 3;
		this.vel = createVector(cos(this.heading), sin(this.heading)).mult(
			this.speed
		);
		this.damage = damage;

		this.pos.add(this.vel.copy().mult(10));
	}
	update() {
		this.move();
		//this.hitDetection();
	}
	render() {
		fill(225, 150, 150);
		circle(this.pos.x, this.pos.y, 6);
		for (let k = 0; k < 20; k++) {
			fill(225, 150, 150, 70 - k * 4.5);
			circle(this.pos.x, this.pos.y, 6 + k * 5);
		}
	}
	move() {
		this.pos.add(this.vel);
	}
	hitDetection() {
		for (let k = 0; k < ShapeSystem.shapes.length; k++) {
			let dis = dist(
				this.pos.x,
				this.pos.y,
				ShapeSystem.shapes[k].pos.x,
				ShapeSystem.shapes[k].pos.y
			);
			if (dis < 13) {
				ShapeSystem.shapes[k].changeHealth(-5);
				return "hit";
			}
		}
	}
}

class bulletSystem {
	constructor() {
		this.bullets = [];
		this.recycle = [];
	}
	add(pos, heading) {
		let obj = new bullet(pos, heading);
		this.bullets.push(obj);
	}
	update() {
		if (this.bullets.length <= 0) {
			return;
		}
		for (let k = 0; k < this.bullets.length; k++) {
			this.bullets[k].update();
			this.bullets[k].hitDetection();
			this.bullets[k].render();
			if (this.isOutOfCanvas(this.bullets[k].pos)) {
				this.bullets.splice(k, 1);
			} else if (this.bullets[k].hitDetection() == "hit") {
				this.bullets.splice(k, 1);
			}
		}
	}

	isOutOfCanvas(pos) {
		return pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height;
	}
}

class shape {
	constructor(pos, speed, type, side) {
		this.pos = pos;
		this.speed = speed;
		this.type = type;
		this.health = type * 5;
		// this.heading = random(TWO_PI);

		switch (side) {
			case 0:
				// this.heading = random(10, -170);
				// this.heading = -90;
				this.vel = createVector(0, 2);
				break;
			case 1:
				// this.heading = random(-100, -260);
				// this.heading = 180;
				this.vel = createVector(-2, 0);
				break;
			case 2:
				// this.heading = 90;
				this.vel = createVector(0, -2);
				break;
			case 3:
				// this.heading = 0;
				this.vel = createVector(2, 0);
				break;
		}

		// this.vel = p5.Vector.fromAngle(this.heading).mult(this.speed);
	}

	update() {
		this.move();
	}

	render() {
		if (this.health <= 5) {
			fill(255, 255, 255);
		} else {
			fill(255, 255, 255);
		}
		circle(this.pos.x, this.pos.y, 20);
		for (let k = 0; k < 20; k++) {
			fill(255, 255, 255, 70 - k * 4.5);
			circle(this.pos.x, this.pos.y, 20 + k * 1.5);
		}
	}

	move() {
		this.pos.add(this.vel);
	}

	changeHealth(value) {
		this.health += value;
	}
}

class shapeSystem {
	constructor() {
		this.shapes = [];
	}

	add() {
		let side = Math.floor(random(4));
		// top || right || bottom || left
		let x, y;
		switch (side) {
			case 0:
				x = random(width);
				y = 20;
				break;
			case 1:
				x = width - 20;
				y = random(height);
				break;
			case 2:
				x = random(width);
				y = height - 20;
				break;
			case 3:
				x = 20;
				y = random(height);
				break;
		}
		let pos = createVector(x, y);
		let speed = random(1, 2);
		let type = Math.floor(random(1, 4));

		let newShape = new shape(pos, speed, type, side);
		this.shapes.push(newShape);
	}

	update() {
		for (let i = this.shapes.length - 1; i >= 0; i--) {
			this.shapes[i].update();
			this.shapes[i].render();
			if (this.isOutOfCanvas(this.shapes[i].pos)) {
				this.shapes.splice(i, 1);
			} else if (this.shapes[i].health <= 0) {
				this.shapes.splice(i, 1);
				score++;
			}
		}
	}

	isOutOfCanvas(pos) {
		return pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height;
	}
}

class Particle {
	constructor(x, y) {
		this.position = createVector(x, y); // 粒子的位置
		this.velocity = p5.Vector.random2D().mult(1);
		this.acceleration = createVector(0, 0); // 粒子的加速度
		this.color = color(random(180, 200), random(180, 200), random(200, 255), 150); // 隨機顏色和透明度
		this.size = random(5, 10); // 粒子的大小
	}

	update(targetX, targetY) {
		let target = createVector(targetX, targetY);
		let direction = p5.Vector.sub(target, this.position);
		direction.setMag(0.2); // 設置推力大小
		this.acceleration = direction;

		this.velocity.add(this.acceleration); // 更新速度
		this.velocity.limit(5); // 限制速度
		this.position.add(this.velocity); // 更新位置
	}

	display() {
		noStroke();
		fill(this.color); // 設置顏色和透明度
		ellipse(this.position.x, this.position.y, this.size, this.size); // 繪製粒子
	}
}

function drawGradientCircle(x, y, diameter) {
	for (let j = 0; j < 20; j++) {
		let alpha = 70 - j * 4.5;
		fill(141, 141, 238, alpha);
		let mappedX = map(x, -1, 1, 50, width - 50);
		let mappedY = map(y, -1, 1, height - 50, 50);
		let mappedDiameter = map(
			diameter + (diameter / 2) * j,
			0,
			diameter * 2,
			0,
			width - 100
		);
		circle(mappedX, mappedY, mappedDiameter);
	}
}

function keyPressed() {
	if (key == "w") {
		Ship.isMove = true;
	}
	if (key == "a") {
		Ship.isRotate = 1;
	}
	if (key == "d") {
		Ship.isRotate = 2;
	}
	if (key === " ") {
		Ship.shoot();
	}
}
function keyReleased() {
	if (key == "w") {
		Ship.isMove = false;
	}
	if (key == "a") {
		Ship.isRotate = 0;
	}
	if (key == "d") {
		Ship.isRotate = 0;
	}
}
