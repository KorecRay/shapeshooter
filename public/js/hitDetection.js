// detect-area-shipRange
let shipRange = 25;

let shipdetectACC = 10;

function detectShip() {
    pg.background(0);
    pg.blendMode(ADD);
    pg.noStroke();
    pg.image(Ship.detect, width / 2, height / 2);
    // Ship.render(true);
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
    let startX = width / 2 - shipRange;
    let startY = height / 2 - shipRange;
    for (let x = startX; x <= shipRange * 2 + startX; x += shipdetectACC) {
        for (let y = startY; y <= shipRange * 2 + startY; y += shipdetectACC) {
            let pixelColor = pg.get(x, y);
            if (pixelColor[0] >= 230 && pixelColor[2] >= 230) {
                // console.log("hit")
                Ship.hit();
            }
        }
    }
    pg.blendMode(BLEND);
    // image(pg, windowWidth / 2, windowHeight / 2);
}

// detect-area-shipRange
let bulletRange = 5;

let bulletdetectACC = 5;

function detectBullet() {
    pg.blendMode(BLEND);
    for (let k in BulletSystem.bullets) {
        // BulletSystem.bullets[k].render(true);
        for (let j in ShapeSystem.shapes) {
            pg.background(0);
            ShapeSystem.shapes[j].render(true);
            // if (dist(ShapeSystem.shapes[j].pos[0], ShapeSystem.shapes[j].pos[1], BulletSystem.bullets[k].pos.x, BulletSystem.bullets[k].pos.y) > ShapeSystem.shapes[j].size) {
            //     continue;
            // }
            let pixelColor = pg.get(BulletSystem.bullets[k].pos.x - Scene.verPos.x + windowWidth / 2, BulletSystem.bullets[k].pos.y - Scene.verPos.y + windowHeight / 2);
            if (pixelColor[0] >= 210) {
                // console.log("bulletHit");
                BulletSystem.bullets[k].hit();
                BulletSystem.bullets[k].broken = true;
                ShapeSystem.shapes[j].hit(BulletSystem.bullets[k].damage);
                break;
            }
        }
    }
    // image(pg, windowWidth / 2, windowHeight / 2);
}