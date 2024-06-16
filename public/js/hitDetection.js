// detect-area-range
let range = 25;

let detectAcc = 10;

function detectShip() {
    pg.background(0);
    pg.blendMode(ADD);
    pg.noStroke();
    pg.image(Ship.detect, width / 2, height / 2);
    let ending = true;
    for (let k in ShapeSystem.shapes) {
        // if (dist(ShapeSystem.shapes[k].pos[0], ShapeSystem.shapes[k].pos[1], Scene.verPos.x, Scene.verPos.y) > 50) {
        //     continue;
        // }
        ShapeSystem.shapes[k].render(true);
        ending = false;
    }
    if (ending) {
        return;
    }
    pg.blendMode(BLEND);
    let startX = width / 2 - range;
    let startY = height / 2 - range;
    for (let x = startX; x <= range * 2 + startX; x += detectAcc) {
        for (let y = startY; y <= range * 2 + startY; y += detectAcc) {
            let pixelColor = pg.get(x, y);
            if (pixelColor[0] >= 230 && pixelColor[2] >= 230) {
                console.log("hit")
                Ship.hit();
            }
        }
    }
    pg.blendMode(BLEND);
    // image(pg, windowWidth / 2, windowHeight / 2);
}

function detectBullet() {
    for (let k in BulletSystem.bullets) {
        pg.background(0);
        pg.image(Ship.detect, width / 2 - 25, height / 2 - 25);
    }
}