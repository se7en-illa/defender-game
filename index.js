const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const modalEl = document.querySelector("#modalEl");
const final = document.querySelector("#final");
const restart = document.querySelector("#restart");
const start = document.querySelector("#start");
const startEl = document.querySelector("#startEl");

canvas.width = innerWidth;
canvas.height = innerHeight;

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

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
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

class Enemy {
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

//                             /$$
//                            | $$
//    /$$$$$$$  /$$$$$$   /$$$$$$$  /$$$$$$
//   /$$_____/ /$$__  $$ /$$__  $$ /$$__  $$
//  | $$      | $$  \ $$| $$  | $$| $$$$$$$$
//  | $$      | $$  | $$| $$  | $$| $$_____/
//  |  $$$$$$$|  $$$$$$/|  $$$$$$$|  $$$$$$$
//   \_______/ \______/  \_______/ \_______/
//
//
//
//   /$$                         /$$
//  |__/                        | $$
//   /$$ /$$$$$$/$$$$   /$$$$$$ | $$  /$$$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$
//  | $$| $$_  $$_  $$ /$$__  $$| $$ /$$__  $$| $$_  $$_  $$ /$$__  $$| $$__  $$
//  | $$| $$ \ $$ \ $$| $$  \ $$| $$| $$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  \ $$
//  | $$| $$ | $$ | $$| $$  | $$| $$| $$_____/| $$ | $$ | $$| $$_____/| $$  | $$
//  | $$| $$ | $$ | $$| $$$$$$$/| $$|  $$$$$$$| $$ | $$ | $$|  $$$$$$$| $$  | $$
//  |__/|__/ |__/ |__/| $$____/ |__/ \_______/|__/ |__/ |__/ \_______/|__/  |__/
//                    | $$
//                    | $$
//                    |__/
//             /$$                 /$$     /$$
//            | $$                | $$    |__/
//           /$$$$$$    /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$
//   /$$$$$$|_  $$_/   |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
//  |______/  | $$      /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
//            | $$ /$$ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
//            |  $$$$/|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
//             \___/   \_______/   \___/  |__/ \______/ |__/  |__/
//
//
//

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, "white");
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let score = 0;
let intervalId;

function init() {
  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  animationId;
  score = 0;
  scoreEl.innerHTML = score;
}

function spawnEnemies() {
  intervalId = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
      //y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
    particle.update();
  }

  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];
    projectile.update();
    console.log(projectiles);
    //remove from edges of screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  }

  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];
    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    //endgame
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      final.innerHTML = score;
      modalEl.style.display = "block";
    }

    for (
      let projectileIdx = projectiles.length - 1;
      projectileIdx >= 0;
      projectileIdx--
    ) {
      const projectile = projectiles[projectileIdx];

      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // when projectiles touch enemies
      if (dist - enemy.radius - projectile.radius < 1) {
        //create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        //this is where we shrink our enemy
        if (enemy.radius - 10 > 5) {
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          projectiles.splice(projectileIdx, 1);
        } else {
          score += 150;
          scoreEl.innerHTML = score;
          //remove enemy if they are too small
          enemies.splice(index, 1);
          projectiles.splice(projectileIdx, 1);
        }
      }
    }
  }
}

//                                             /$$
//                                            | $$
//    /$$$$$$  /$$    /$$ /$$$$$$  /$$$$$$$  /$$$$$$
//   /$$__  $$|  $$  /$$//$$__  $$| $$__  $$|_  $$_/
//  | $$$$$$$$ \  $$/$$/| $$$$$$$$| $$  \ $$  | $$
//  | $$_____/  \  $$$/ | $$_____/| $$  | $$  | $$ /$$
//  |  $$$$$$$   \  $/  |  $$$$$$$| $$  | $$  |  $$$$/
//   \_______/    \_/    \_______/|__/  |__/   \___/
//
//
//
//   /$$ /$$             /$$
//  | $$|__/            | $$
//  | $$ /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
//  | $$| $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
//  | $$| $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$
//  | $$| $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
//  | $$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
//  |__/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |_______/
//
//
//

addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - y, event.clientX - x);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  projectiles.push(new Projectile(x, y, 5, "white", velocity));
});

restart.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  modalEl.style.display = "none";
});

start.addEventListener("click", () => {
  startEl.style.display = "none";
  init();
  animate();
  spawnEnemies();
});
