class bullet {
	constructor(pos, heading, speed, damage) {
		this.pos = pos;
		this.heading = radians(heading);
		this.speed = speed;
		console.log(heading)
		this.vel = createVector(cos(this.heading), sin(this.heading)).mult(
			this.speed
		);
		this.damage = damage;
		this.pos.add(this.vel.copy().mult(10));
		this.frame = 0;
		this.broken = false;
		// this.die = setTimeout(this.hitDetection(true), 2500);
	}
	update() {
		this.move();
		this.frame++
		if (this.frame >= 150) {
			this.broken = true;
		}
	}
	render() {
		noStroke();
		fill(29, 207, 106);
		circle(this.pos.x - Scene.verPos.x + windowWidth / 2, this.pos.y - Scene.verPos.y + windowHeight / 2, 10);
		for (let k = 0; k < 5; k++) {
			fill(29, 207, 106, 70 - k * 4.5);
			circle(this.pos.x - Scene.verPos.x + windowWidth / 2, this.pos.y - Scene.verPos.y + windowHeight / 2, 10 + k * 5);
		}
	}
	move() {
		this.pos.add(this.vel);
	}
	hitDetection(force = false) {
		if (force) {
			return "hit";
		}
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
		let obj = new bullet(pos, heading, 10);
		this.bullets.push(obj);
	}
	update() {
		if (this.bullets.length <= 0) {
			return;
		}
		for (let k = 0; k < this.bullets.length; k++) {
			this.bullets[k].update();
			// this.bullets[k].hitDetection();
			this.bullets[k].render();
			if (this.bullets[k].broken) {
				this.bullets.splice(k, 1);
			}
			// if (this.bullets[k].hitDetection() == "hit") {
			// 	this.bullets.splice(k, 1);
			// }
		}
	}
}