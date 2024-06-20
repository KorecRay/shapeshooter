let progressBar;

// function setup() {
//     createCanvas(600, 600);
//     angleMode(DEGREES);
//     rectMode(CENTER);
//     textAlign(CENTER, CENTER);

//     progressBar = new ProgressBar(width / 2 - 200, height - 50, 400, 10, 10);
// }

// function draw() {
//     let dif = frameCount - progressBar.current;
//     background(100, 50);
//     progressBar.update();
//     progressBar.display();
// }

// class ProgressBar {
//     constructor(x, y, w, h, r) {
//         this.x = x;
//         this.y = y;
//         this.w = w;
//         this.h = h;
//         this.r = r;
//         this.current = 0;
//     }

//     update() {
//         this.w = clamp(map(score%500, 0, 500, 0, 400), 15, 400);
//     }

//     display() {
//         let b_x = this.x;
//         let b_y = this.y;
//         let b_w = this.w;
//         let b_h = this.h;
//         let b_r = this.r;

//         beginShape();
//         noStroke();
//         fill(0, 250, 0, 150);
//         vertex(b_x + b_r, b_y);
//         bezierVertex(b_x, b_y, b_x, b_y + b_h, b_x + b_r, b_y + b_h);
//         vertex(b_x + b_w - b_r, b_y + b_h);
//         bezierVertex(b_x + b_w, b_y + b_h, b_x + b_w, b_y, b_x + b_w - b_r, b_y);
//         endShape(CLOSE);

//         this.drawGlow(b_x, b_y, b_w, b_h, b_r, color(0, 250, 0, 150));
//     }

//     drawGlow(b_x, b_y, b_w, b_h, b_r, glowColor) {
//         noFill();
//         let glowStrength = 10;
//         let transparency = 7;

//         for (let i = 0; i < glowStrength; i++) {
//             let alpha = map(i, 0, glowStrength, transparency, 0);
//             stroke(red(glowColor), green(glowColor), blue(glowColor), alpha);
//             strokeWeight(8 - i * 0.4);
//             beginShape();
//             vertex(b_x + b_r, b_y);
//             bezierVertex(b_x, b_y, b_x, b_y + b_h, b_x + b_r, b_y + b_h);
//             vertex(b_x + b_w - b_r, b_y + b_h);
//             bezierVertex(b_x + b_w, b_y + b_h, b_x + b_w, b_y, b_x + b_w - b_r, b_y);
//             endShape(CLOSE);
//         }
//     }
// }
// function clamp(val, min, max) {
//     return Math.min(Math.max(val, min), max);
// }

class ProgressBar {
    constructor(x, y, w, h, r) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = r;
    }

    display() {
        let b_w = clamp(map(score % 500, 0, 500, 0, 400), 15, 400);

        beginShape();
        vertex(this.x + this.r, this.y);
        bezierVertex(this.x, this.y, this.x, this.y + this.h, this.x + this.r, this.y + this.h);
        vertex(this.x + this.w - this.r, this.y + this.h);
        bezierVertex(this.x + this.w, this.y + this.h, this.x + this.w, this.y, this.x + this.w - this.r, this.y);
        endShape(CLOSE);

        this.drawGlow(this.x, this.y, b_w, this.h, this.r, color(0, 250, 0, 150));


        beginShape();
        noStroke();
        fill(0, 250, 0, 150);
        vertex(this.x + this.r, this.y);
        bezierVertex(this.x, this.y, this.x, this.y + this.h, this.x + this.r, this.y + this.h);
        vertex(this.x + b_w - this.r, this.y + this.h);
        bezierVertex(this.x + b_w, this.y + this.h, this.x + b_w, this.y, this.x + b_w - this.r, this.y);
        endShape(CLOSE);
    }

    drawGlow(b_x, b_y, b_w, b_h, b_r, glowColor) {
        noFill();
        let glowStrength = 10;
        let transparency = 7;

        for (let i = 0; i < glowStrength; i++) {
            let alpha = map(i, 0, glowStrength, transparency, 0);
            stroke(red(glowColor), green(glowColor), blue(glowColor), alpha);
            strokeWeight(8 - i * 0.4);
            beginShape();
            vertex(b_x + b_r, b_y);
            bezierVertex(b_x, b_y, b_x, b_y + b_h, b_x + b_r, b_y + b_h);
            vertex(b_x + b_w - b_r, b_y + b_h);
            bezierVertex(b_x + b_w, b_y + b_h, b_x + b_w, b_y, b_x + b_w - b_r, b_y);
            endShape(CLOSE);
        }
    }
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}
