const canvas = document.getElementById('fishCanvas');
const ctx = canvas.getContext('2d');

// Canvas auf aktuelle Größe setzen
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Fischbilder laden
const fishImages = ['img/1.png', 'img/2.png', 'img/3.png','img/4.png','img/5.png'].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Fisch-Klasse
class Fish {
    constructor() {
        this.img = fishImages[Math.floor(Math.random() * fishImages.length)];
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = 1 + Math.random() * 2;
        this.direction = Math.random() < 0.5 ? 1 : -1; // Links oder rechts
        this.size = 30 + Math.random() * 20;
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x > canvas.width || this.x < -this.size) {
            this.direction *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.direction, 1); // Fisch spiegeln, wenn er Richtung wechselt
        ctx.drawImage(this.img, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

// Fische erstellen
const fishes = [];
for (let i = 0; i < 100; i++) {
    fishes.push(new Fish());
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fishes.forEach(fish => {
        fish.update();
        fish.draw();
    });
    requestAnimationFrame(animate);
}

// Warten bis alle Bilder geladen sind
Promise.all(fishImages.map(img => new Promise(res => img.onload = res)))
    .then(() => animate());
