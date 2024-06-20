class ship {
	constructor() {
		this.pos = createVector(width / 2, height / 2);
		this.heading = mouseDegree;
		this.speed = 4;
		this.damage = 10;
		this.health = 10;
		this.shield = true;
		this.cd = false;
		this.hitcd = false;
		this.png = loadImage("../../public/src/png/ship_normal.png");
		this.detect = loadImage("../../public/src/png/ship_detect.png");

	}
	rotate(direc) {
		// this.rot = lerp(this.rot, mouseDegree, 0.05);
		this.heading = atan2(mouseDegree);
	}
	shot() {
		if (frameCount % 30 == 0) {
			// console.log("shot")
			BulletSystem.add(createVector(Scene.verPos.x, Scene.verPos.y), degrees(atan2(mouseY - height / 2, mouseX - width / 2)));
		}

	}
	render(detect = false) {
		push();
		rotate(this.heading);
		if (this.shield == false) {
			if (frameCount % 10 == 0) {
				return;
			}
			image(this.png, width / 2, height / 2);
			return;
		}
		image(this.png, width / 2, height / 2);
		// if (detect) {
		// 	fill(0, 0, 255)
		// 	push();
		// 	translate(this.pos.x, this.pos.y);
		// 	rotate(this.heading + 90);
		// 	triangle(-24, 20, 0, -70, 24, 20);
		// 	triangle(-20, 20, 0, -60, 20, 20);
		// 	triangle(-30, 20, -20, -30, -10, 20);
		// 	triangle(30, 20, 20, -30, 10, 20);
		// 	pop();
		// } else {
		// 	push();
		// 	translate(this.pos.x, this.pos.y);
		// 	rotate(mouseDegree + 90);
		// 	console.log(mouseDegree)
		// 	fill("#fe637a");
		// 	triangle(-24, 20, 0, -70, 24, 20);
		// 	fill("#41637a");
		// 	triangle(-20, 20, 0, -60, 20, 20);

		// 	fill("#4cc3e0");
		// 	triangle(-30, 20, -20, -30, -10, 20);

		// 	fill("#4cc3e0");
		// 	triangle(30, 20, 20, -30, 10, 20);
		// 	pop();
		// }

	}
	update() {
		this.rotate();
		this.shot();
		this.render();
	}
	hit() {
		if (this.hitcd) {
			return;
		}
		this.hitcd = true;
		setTimeout(() => { this.hitcd = false }, 2000);
		if (this.shield) {
			this.shield = false;
			setTimeout(() => { this.shield = true; }, 8500);
		} else {
			die();
		}
	}
}