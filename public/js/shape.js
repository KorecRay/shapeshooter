let spREGX = {
    1: {
        id: "1",
        basehealth: 5,
        basespeed: 3,
        _init: function () {

        }
    },
    2: {
        id: "2",
        basehealth: 7,
        basespeed: 3,
        _init: () => {

        }
    },
    3: {
        id: "3",
        basehealth: 8,
        basespeed: 3,
        _init: () => {

        }
    }
}

class shape {
    constructor(type, pos, heading) {
        // this.id = spREGX[type].id;
        this.type = type;
        this.size = random(40, 51).toFixed(2);
        this.health = this.size / 5 * spREGX[type].basehealth * (level + 1) / 2;
        // this.blend
        this.pos = pos;
        this.heading = heading;
        this.speed = spREGX[type].basespeed;
        this.vel = createVector(cos(this.heading), sin(this.heading)).mult(
            this.speed
        );
        this.broken = false;
        this.end = millis() + 5000;
    }
    update() {
        if (millis() > this.end) {
            this.broken = true;
            return;
        }
        if (this.health <= 0) {
            if (!this.broken) {
                this.broken = true;
                score += this.size / 2;
                console.log(7)
            }
            return;
        }
        if (this.type == 3) {
            this.heading = atan2(this.pos[0] - Scene.verPos.x, this.pos[1] - Scene.verPos.y);
        }
        this.move();
        this.render();
    }
    move() {
        // let dx = cos(this.heading) * this.speed;
        // let dy = sin(this.heading) * this.speed;
        this.pos[0] += this.vel.x;
        this.pos[1] += this.vel.y;
    }
    hit(damage) {
        this.health -= damage;
    }
    render(detect = false) {
        let vX = this.pos[0] - Scene.verPos.x + windowWidth / 2;
        let vY = this.pos[1] - Scene.verPos.y + windowHeight / 2;
        if (detect) {
            pg.fill(255, 0, 0)
            switch (this.type) {
                case 1:
                    pg.rect(vX, vY, this.size * 2, this.size * 2);
                    break;
                case 2:
                    pg.push();
                    pg.translate(vX, vY);
                    pg.rotate(this.heading);
                    pg.fill(255, 0, 0);
                    pg.triangle(-this.size, this.size, this.size, this.size, 0, -this.size);
                    pg.pop();
                    break;
                case 3:
                    pg.circle(vX, vY, this.size * 2);
                    break;
            }
            return;
        }
        stroke(230, 230, 230);
        strokeWeight(2)
        switch (this.type) {
            case 1:
                fill(252, 141, 81)
                rect(vX, vY, this.size * 2, this.size * 2);
                break;
            case 2:
                fill(195, 81, 252)
                push();
                translate(vX, vY);
                rotate(this.heading);
                fill(255, 0, 0);
                triangle(-this.size, this.size, this.size, this.size, 0, -this.size);
                pop();
                break;
            case 3:
                fill(120, 214, 99)
                circle(vX, vY, this.size * 2);
                break;
        }
        strokeWeight(0);
        textSize(25);
        fill(255, 255, 255);
        textAlign(CENTER);
        stroke(255, 255, 255);
        text(this.health.toFixed(1), vX, vY)
    }

}

class shapeSystem {
    constructor() {
        this.shapes = [];
        this.recycle = [];
        this.update = this.update.bind(this);
    }
    createShapes(type) {
        if (this.shapes.length >= 50) {
            return;
        }
        if (!type) {
            type = floor(random(1, 4));
        }
        //  generate positions
        let coord = generateValidCoordinate();
        let pos = [coord.x, coord.y]
        // set headingtion
        let heading = null;
        switch (type) {
            case 1: // square
                if (pos[0] > Scene.verPos.x) {
                    if (pos[1] > Scene.verPos.y) {
                        heading = -90;
                    } else {
                        heading = 0;
                    }
                } else {
                    if (pos[1] > Scene.verPos.y) {
                        heading = 180;
                    } else {
                        heading = 90;
                    }
                }
                break;
            case 2: // triangle
                heading = random(-180, 180);
                break;
            case 3: // circle
                heading = atan2(coord.x - Scene.verPos.x, coord.y - Scene.verPos.y);
                break;
        }
        let tr = new shape(type, pos, radians(heading));
        this.shapes.push(tr);
    }
    update() {
        for (let k in this.shapes) {
            if (this.shapes[k].broken) {
                this.shapes.splice(k, 1);
                continue;
            }
            this.shapes[k].update();
        }
    }
}

let outerRange = 2000;
let innerRange = 1000;

function generateValidCoordinate() {
    let x, y;
    let centerStart = (outerRange - innerRange) / 2;
    let centerEnd = centerStart + innerRange;

    do {
        x = random(outerRange);
        y = random(outerRange);
    } while (x > centerStart && x < centerEnd && y > centerStart && y < centerEnd);
    x = x - outerRange / 2 + Scene.verPos.x;
    y = y - outerRange / 2 + Scene.verPos.y;
    // console.log({ x, y })
    return { x, y };
}