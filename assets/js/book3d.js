// Book3D.js - 3D Book Animation with Three.js

// Variables
let camera, scene, renderer, book;
let targetRotationX = 0;
let targetRotationY = 0;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let bookCover, bookPages, bookBack;
let isBookOpen = false; // Set the book to be closed by default

// Initialize the 3D scene
function init() {
    // Get container element
    const container = document.getElementById('book-container');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 5); // Adjusted camera position for closed book
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add a second directional light for better shading
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-1, -1, 1);
    scene.add(directionalLight2);
    
    // Create book group
    book = new THREE.Group();
    scene.add(book);
    
    // Create materials for the book - dark gray color
    const darkGray = 0x333333;
    const coverMaterial = new THREE.MeshStandardMaterial({
        color: darkGray,
        roughness: 0.3,
        metalness: 0.1
    });
    
    const pageMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee, // Light gray for pages
        roughness: 0.5
    });
    
    const spineMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222, // Darker gray for spine
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Book dimensions
    const width = 2;
    const height = 3;
    const depth = 0.3; // Slightly thicker for a substantial look
    const pageDepth = 0.01;
    
    // Create front cover
    const coverGeometry = new THREE.BoxGeometry(width, height, 0.05);
    bookCover = new THREE.Mesh(coverGeometry, coverMaterial);
    bookCover.position.z = depth / 2 - 0.025;
    book.add(bookCover);
    
    // Create pages (multiple thin layers)
    const pageCount = 10;
    const pageGroup = new THREE.Group();
    
    for (let i = 0; i < pageCount; i++) {
        const pageGeometry = new THREE.BoxGeometry(width - 0.1, height - 0.1, pageDepth);
        const page = new THREE.Mesh(pageGeometry, pageMaterial);
        page.position.z = (depth / 2) - 0.05 - (i * pageDepth) - (pageDepth / 2);
        pageGroup.add(page);
    }
    
    book.add(pageGroup);
    bookPages = pageGroup;
    
    // Create back cover
    const backGeometry = new THREE.BoxGeometry(width, height, 0.05);
    bookBack = new THREE.Mesh(backGeometry, coverMaterial);
    bookBack.position.z = -depth / 2 + 0.025;
    book.add(bookBack);
    
    // Create spine
    const spineGeometry = new THREE.BoxGeometry(0.1, height, depth);
    const spine = new THREE.Mesh(spineGeometry, spineMaterial);
    spine.position.x = -width / 2 - 0.05;
    book.add(spine);
    
    // Add text to the spine (using a plane with texture)
    try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        context.fillStyle = '#cccccc'; // Light gray text
        context.font = 'Bold 40px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('ACHARYA PATH', canvas.width / 2, canvas.height / 2);
        
        const spineTexture = new THREE.CanvasTexture(canvas);
        const spineTextMaterial = new THREE.MeshBasicMaterial({
            map: spineTexture,
            transparent: true
        });
        
        const spineTextGeometry = new THREE.PlaneGeometry(0.1, 2);
        const spineText = new THREE.Mesh(spineTextGeometry, spineTextMaterial);
        spineText.rotation.y = Math.PI / 2;
        spineText.position.x = -width / 2 - 0.05 - 0.01;
        spineText.position.z = 0;
        book.add(spineText);
    } catch (e) {
        console.error("Error creating spine text", e);
    }
    
    // Add embossed text/logo on the front cover
    try {
        const coverCanvas = document.createElement('canvas');
        const coverContext = coverCanvas.getContext('2d');
        coverCanvas.width = 512;
        coverCanvas.height = 768;
        
        // Dark gray background matching the cover
        coverContext.fillStyle = '#333333';
        coverContext.fillRect(0, 0, coverCanvas.width, coverCanvas.height);
        
        // Add embossed effect for text
        coverContext.shadowColor = '#222222';
        coverContext.shadowBlur = 15;
        coverContext.shadowOffsetX = 5;
        coverContext.shadowOffsetY = 5;
        
        // Title text
        coverContext.fillStyle = '#444444'; // Slightly lighter than background for embossing
        coverContext.font = 'Bold 60px Georgia';
        coverContext.textAlign = 'center';
        coverContext.fillText('ACHARYA', coverCanvas.width / 2, 200);
        coverContext.fillText('PATH', coverCanvas.width / 2, 280);
        
        // Add a simple decorative line
        coverContext.beginPath();
        coverContext.moveTo(coverCanvas.width / 4, 320);
        coverContext.lineTo(coverCanvas.width * 3 / 4, 320);
        coverContext.strokeStyle = '#444444';
        coverContext.lineWidth = 3;
        coverContext.stroke();
        
        // Add a subtle pattern or texture if desired
        for (let i = 0; i < coverCanvas.width; i += 20) {
            for (let j = 0; j < coverCanvas.height; j += 20) {
                if ((i + j) % 40 === 0) {
                    coverContext.fillStyle = 'rgba(60, 60, 60, 0.1)';
                    coverContext.fillRect(i, j, 10, 10);
                }
            }
        }
        
        const coverTexture = new THREE.CanvasTexture(coverCanvas);
        const coverTextMaterial = new THREE.MeshStandardMaterial({
            map: coverTexture,
            bumpMap: coverTexture,
            bumpScale: 0.02,
            roughness: 0.4
        });
        
        // Replace the default material with the textured one
        bookCover.material = coverTextMaterial;
    } catch (e) {
        console.error("Error creating cover design", e);
    }
    
    // Initial positioning of the book
    book.rotation.x = 0.2;
    book.rotation.y = -0.5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    
    // Add event listeners
    container.addEventListener('mousemove', onDocumentMouseMove, false);
    container.addEventListener('touchstart', onDocumentTouchStart, false);
    container.addEventListener('touchmove', onDocumentTouchMove, false);
    
    window.addEventListener('resize', onWindowResize, false);
}

// Event handlers
function onWindowResize() {
    const container = document.getElementById('book-container');
    windowHalfX = container.clientWidth / 2;
    windowHalfY = container.clientHeight / 2;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function onDocumentMouseMove(event) {
    // Calculate mouse position relative to the container
    const container = document.getElementById('book-container');
    const rect = container.getBoundingClientRect();
    mouseX = (event.clientX - rect.left - windowHalfX) / 100;
    mouseY = (event.clientY - rect.top - windowHalfY) / 100;
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        
        const container = document.getElementById('book-container');
        const rect = container.getBoundingClientRect();
        mouseX = (event.touches[0].pageX - rect.left - windowHalfX) / 100;
        mouseY = (event.touches[0].pageY - rect.top - windowHalfY) / 100;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        
        const container = document.getElementById('book-container');
        const rect = container.getBoundingClientRect();
        mouseX = (event.touches[0].pageX - rect.left - windowHalfX) / 100;
        mouseY = (event.touches[0].pageY - rect.top - windowHalfY) / 100;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // Smoothly rotate the book based on mouse position
    targetRotationY += (mouseX * 0.05 - targetRotationY) * 0.05;
    targetRotationX += (mouseY * 0.05 - targetRotationX) * 0.05;
    
    book.rotation.y = targetRotationY;
    book.rotation.x = targetRotationX + 0.2; // Add a slight tilt
    
    // Float animation
    const time = Date.now() * 0.001;
    book.position.y = Math.sin(time) * 0.1;
    
    renderer.render(scene, camera);
}

// Start the animation when the window loads
window.addEventListener('load', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Please include the Three.js library.');
        return;
    }
    
    // Initialize and animate
    init();
    animate();
}); 