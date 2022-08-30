//             /$$
//            | $$
//    /$$$$$$$| $$  /$$$$$$   /$$$$$$$ /$$$$$$$  /$$$$$$   /$$$$$$$
//   /$$_____/| $$ |____  $$ /$$_____//$$_____/ /$$__  $$ /$$_____/
//  | $$      | $$  /$$$$$$$|  $$$$$$|  $$$$$$ | $$$$$$$$|  $$$$$$
//  | $$      | $$ /$$__  $$ \____  $$\____  $$| $$_____/ \____  $$
//  |  $$$$$$$| $$|  $$$$$$$ /$$$$$$$//$$$$$$$/|  $$$$$$$ /$$$$$$$/
//   \_______/|__/ \_______/|_______/|_______/  \_______/|_______/
//
//
//

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.type = "Linear";
    this.radians = 0;
    this.center = {
      x,
      y,
    };

    if (Math.random() < 0.5) {
      this.type = "Homing";

      if (Math.random() < 0.5) {
        this.type = "Spinning";

        if (Math.random() < 0.5) {
          this.type = "Homing Spinning";
        }
      }
    }
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    if (this.type === "Spinning") {
      this.radians += 0.1;

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 30;
      this.y = this.center.y + Math.sin(this.radians) * 30;
    } else if (this.type === "Homing") {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

      this.x += this.velocity.x;
      this.y += this.velocity.y;
    } else if (this.type === "Homing Spinning") {
      this.radians += 0.1;

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      const angle = Math.atan2(
        player.y - this.center.y,
        player.x - this.center.x
      );
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

      this.x = this.center.x + Math.cos(this.radians) * 30;
      this.y = this.center.y + Math.sin(this.radians) * 30;
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
  }
}
const friction = 0.99;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.powerUp;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    const friction = 0.98;

    this.velocity.x *= friction;
    this.velocity.y *= friction;

    //collision detection for x
    if (
      this.x + this.radius + this.velocity.x <= canvas.width &&
      this.x - this.radius + this.velocity.x >= 0
    ) {
      this.x += this.velocity.x;
    } else {
      this.velocity.x = 0;
    }

    //collision detection for y
    if (
      this.y + this.radius + this.velocity.y <= canvas.width &&
      this.y - this.radius + this.velocity.y >= 0
    ) {
      this.y += this.velocity.y;
    } else {
      this.velocity.y = 0;
    }
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//
//
//    /$$$$$$   /$$$$$$  /$$  /$$  /$$  /$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$$
//   /$$__  $$ /$$__  $$| $$ | $$ | $$ /$$__  $$ /$$__  $$| $$  | $$ /$$__  $$ /$$_____/
//  | $$  \ $$| $$  \ $$| $$ | $$ | $$| $$$$$$$$| $$  \__/| $$  | $$| $$  \ $$|  $$$$$$
//  | $$  | $$| $$  | $$| $$ | $$ | $$| $$_____/| $$      | $$  | $$| $$  | $$ \____  $$
//  | $$$$$$$/|  $$$$$$/|  $$$$$/$$$$/|  $$$$$$$| $$      |  $$$$$$/| $$$$$$$/ /$$$$$$$/
//  | $$____/  \______/  \_____/\___/  \_______/|__/       \______/ | $$____/ |_______/
//  | $$                                                            | $$
//  | $$                                                            | $$
//  |__/                                                            |__/

//const powerUp = new PowerUp({ x: 100, y: 100, velocity: { x: 0, y: 0 } });

class PowerUp {
  constructor({ position = { x: 0, y: 0 }, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.image = new Image();
    this.image.src = "./img/lightningBolt.png";

    this.alpha = 1;
    gsap.to(this, {
      alpha: 0,
      duration: 0.3,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });

    this.radians = 0;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.translate(
      this.position.x + this.image.width / 2,
      this.position.y + this.image.height / 2
    );
    c.rotate(this.radians);
    c.translate(
      -this.position.x - this.image.width / 2,
      -this.position.y - this.image.height / 2
    );
    c.drawImage(this.image, this.position.x, this.position.y);
    c.restore();
  }

  update() {
    this.draw();
    this.radians += 0.01;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
