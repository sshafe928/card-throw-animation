const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Set up lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create the card
const cardGeometry = new THREE.PlaneGeometry(1, 1.5);
const cardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const card = new THREE.Mesh(cardGeometry, cardMaterial);
card.position.set(0, -2, 0); // Start lower on the screen
card.castShadow = true;
scene.add(card);

// Add a light source to the upper end of the card
const cardLight = new THREE.PointLight(0xffffff, 1, 10); // Yellow light
cardLight.position.set(0.5, 0.5, 0); // Position at the upper end of the card
scene.add(cardLight);

// Set up the camera position
camera.position.z = 4;

// Animate the card with projectile motion
function throwCard() {
    // Initial upward motion
    gsap.to(card.position, {
        y: 1, // Go up
        duration: 0.5,
        ease: "power1.in", // Smooth upward motion
        onComplete: () => {
            // After reaching the peak, go down
            gsap.to(card.position, {
                y: 0, // Down to the table level
                z: -5, // Move back
                duration: 1,
                ease: "power1.out",
                onComplete: () => {
                    // Reset card position if needed
                    card.position.set(0, -2, 0);
                    card.rotation.set(0, 0, 0); // Reset rotation for next throw
                }
            });
        }
    });

    // Skew the card for depth perception (shorten the top end)
    gsap.to(card.rotation, {
        x: Math.PI / 4, // Adjust skew to make the upper end shorter
        duration: 1,
        ease: "power1.out"
    });
}

// Event listener to trigger the throw
window.addEventListener('click', throwCard);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});