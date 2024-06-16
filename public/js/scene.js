let gridSize = 100;
let offsetX = 0, offsetY = 0;
class scene {
    constructor() {
        this.verPos = createVector(0, 0);
    }
    move(ver) {
        this.verPos.add(ver);
        stroke(255, 255, 255)
        strokeWeight(0)
        fill(255, 255, 255);
        text("posX" + this.verPos.x.toFixed(2) + "  ||  posY" + this.verPos.y.toFixed(2), 20, windowHeight - 20);
        this.draw(ver.x, ver.y);
        // console.log(ver.x, "||", ver.y);
    }
    draw(verX, verY) {
        if (offsetX > gridSize) {
            offsetX = offsetX - gridSize;
        } else if (offsetX < -gridSize) {
            offsetX = offsetX + gridSize;
        }
        if (offsetY > gridSize) {
            offsetY = offsetY - gridSize;
        } else if (offsetY < -gridSize) {
            offsetY = offsetY + gridSize;
        }
        offsetX += verX
        offsetY += verY
        let x = -gridSize - offsetX
        let y = -gridSize - offsetY;
        stroke(60, 60, 60)
        strokeWeight(4)
        while (x <= windowWidth) {
            line(x, 0, x, windowHeight);
            x += gridSize;
        }
        while (y <= windowHeight) {
            line(0, y, windowWidth, y);
            y += gridSize;
        }
    }
}