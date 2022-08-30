const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreEl = document.querySelector("#score");
const modalEl = document.querySelector("#modalEl");
const final = document.querySelector("#final");
const restart = document.querySelector("#restart");
const start = document.querySelector("#start");
const startEl = document.querySelector("#startEl");
const volumeUp = document.querySelector("#volumeUp");
const volumeOff = document.querySelector("#mute");

canvas.width = innerWidth;
canvas.height = innerHeight;

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
let powerUps = [];
let frames = 0;
let spawnPowerUpsId;
let backgroundParticles = [];
let game = {
  active: false,
};

function init() {
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  player = new Player(x, y, 10, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  powerUps = [];
  animationId;
  score = 0;
  scoreEl.innerHTML = score;
  frames = 0;
  backgroundParticles = [];
  game = {
    active: true,
  };

  for (let x = 0; x < canvas.width + 50; x += 50) {
    for (let y = 0; y < canvas.height + 50; y += 50) {
      backgroundParticles.push(
        new BackgroundParticle({
          position: {
            x,
            y,
          },
        })
      );
    }
  }
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

    if (enemies.length < 15) {
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }
  }, 1000);
}

function spawnPowerUps() {
  spawnPowerUpsId = setInterval(() => {
    powerUps.push(
      new PowerUp({
        position: {
          x: -30,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: Math.random() + 2,
          y: 0,
        },
      })
    );
  }, 7000);
}

function createScoreLabel({ position, score }) {
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = score;
  scoreLabel.style.color = "white";
  scoreLabel.style.position = "absolute";
  scoreLabel.style.left = position.x + "px";
  scoreLabel.style.top = position.y + "px";
  scoreLabel.style.userSelect = "none";
  scoreLabel.style.pointerEvents = "none";
  document.body.appendChild(scoreLabel);

  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      scoreLabel.parentNode.removeChild(scoreLabel);
    },
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  frames++;

  //backgroundparticles

  backgroundParticles.forEach((particle) => {
    particle.draw();

    const dist = Math.hypot(
      player.x - particle.position.x,
      player.y - particle.position.y
    );

    if (dist < 100) {
      particle.alpha = 0;
      if (dist > 70) {
        particle.alpha = 0.5;
      }
    } else if (dist > 100 && particle.alpha < 0.1) {
      particle.alpha += 0.01;
    } else if (dist > 100 && particle.alpha > 0.1) {
      particle.alpha -= 0.01;
    }
  });

  //player
  player.update();

  //powerups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];

    if (powerUp.position.x > canvas.width) {
      powerUps.splice(i, 1);
    } else {
      powerUp.update();
    }

    const dist = Math.hypot(
      player.x - powerUp.position.x,
      player.y - powerUp.position.y
    );

    //gain powerup
    if (dist < powerUp.image.height / 2 + player.radius) {
      powerUps.splice(i, 1);
      player.powerUp = "MachineGun";
      player.color = "purple";
      audio.powerUp.play();
      setTimeout(() => {
        player.powerUp = null;
        player.color = "white";
      }, 5000);
    }
  }

  //machine gun animation / implementation
  if (player.powerUp === "MachineGun") {
    const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    if (frames % 2 === 0) {
      projectiles.push(
        new Projectile(player.x, player.y, 5, "purple", velocity)
      );
    }

    if (frames % 8 === 0) {
      audio.shoot.play();
    }
  }

  //particles
  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index];
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
    particle.update();
  }

  //projectiles
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index];
    projectile.update();
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

  //enemies
  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index];

    enemy.update();

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    //endgame
    if (dist - enemy.radius - player.radius < 1) {
      audio.death.play();
      game.active = false;
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
      final.innerHTML = score;
      modalEl.style.display = "block";
      gsap.fromTo(
        "#modalEl",
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: "expo.out",
        }
      );
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
          audio.damage.play();
          score += 100;
          scoreEl.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 100,
          });
          projectiles.splice(projectileIdx, 1);
        } else {
          audio.explode.play();
          score += 150;
          scoreEl.innerHTML = score;
          createScoreLabel({
            position: {
              x: projectile.x,
              y: projectile.y,
            },
            score: 150,
          });
          //remove enemy if they are too small
          //change particle color
          backgroundParticles.forEach((particle) => {
            gsap.set(particle, {
              color: "white",
              alpha: 1,
            });
            gsap.to(particle, {
              color: enemy.color,
              alpha: 0.1,
            });
          });
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

function shoot({ x, y }) {
  if (game.active === true) {
    const angle = Math.atan2(y - player.y, x - player.x);

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };

    projectiles.push(new Projectile(player.x, player.y, 5, "white", velocity));

    audio.shoot.play();
  }
}

let audioInitialized = false;

window.addEventListener("click", (event) => {
  if (!audio.background.playing() && !audioInitialized) {
    audio.background.play();
    audioInitialized = true;
  }

  shoot({ x: event.clientX, y: event.clientY });
});

//mute everything
volumeUp.addEventListener("click", () => {
  audio.background.pause();
  volumeOff.style.display = "block";
  volumeUp.style.display = "none";

  for (let key in audio) {
    audio[key].mute(true);
  }
});

//volume up everything
volumeOff.addEventListener("click", () => {
  if (audioInitialized) {
    audio.background.play();
    volumeOff.style.display = "none";
    volumeUp.style.display = "block";

    for (let key in audio) {
      audio[key].mute(false);
    }
  }
});

const mouse = {
  x: 0,
  y: 0,
};

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

restart.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  gsap.to("#modalEl", {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "expo.in",
    onComplete: () => {
      modalEl.style.display = "none";
    },
  });
});

start.addEventListener("click", () => {
  audio.select.play();
  init();
  animate();
  spawnEnemies();
  spawnPowerUps();
  gsap.to("#startEl", {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "expo.in",
    onComplete: () => {
      startEl.style.display = "none";
    },
  });
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      player.velocity.x += 1;
      break;
    case "ArrowLeft":
      player.velocity.x -= 1;
      break;
    case "ArrowUp":
      player.velocity.y -= 1;
      break;
    case "ArrowDown":
      player.velocity.y += 1;
      break;
    //----------------------
    case "d":
      player.velocity.x += 1;
      break;
    case "a":
      player.velocity.x -= 1;
      break;
    case "w":
      player.velocity.y -= 1;
      break;
    case "s":
      player.velocity.y += 1;
      break;
  }
});

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

window.addEventListener("touchstart", (event) => {
  const x = event.touches[0].clientX;
  const y = event.touches[0].clientY;

  shoot({ x, y });
});
