import * as THREE from 'three';

export class BoxEnvironment {
    constructor(size) {
        this.size = size;
        this.points = new THREE.Group();
        this.generateBox();
    }

    generateBox() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const pointCount = 20000; // Increased point count
        const halfSize = this.size / 2;
        
        // Generate points for each face
        for (let i = 0; i < pointCount; i++) {
            let x, y, z;
            const face = Math.floor(Math.random() * 6);
            
            // Add slight variation to points
            const variance = this.size * 0.02;
            
            switch(face) {
                case 0: // Front
                    x = (Math.random() * 2 - 1) * halfSize;
                    y = (Math.random() * 2 - 1) * halfSize;
                    z = halfSize + (Math.random() - 0.5) * variance;
                    break;
                case 1: // Back
                    x = (Math.random() * 2 - 1) * halfSize;
                    y = (Math.random() * 2 - 1) * halfSize;
                    z = -halfSize + (Math.random() - 0.5) * variance;
                    break;
                case 2: // Top
                    x = (Math.random() * 2 - 1) * halfSize;
                    y = halfSize + (Math.random() - 0.5) * variance;
                    z = (Math.random() * 2 - 1) * halfSize;
                    break;
                case 3: // Bottom
                    x = (Math.random() * 2 - 1) * halfSize;
                    y = -halfSize + (Math.random() - 0.5) * variance;
                    z = (Math.random() * 2 - 1) * halfSize;
                    break;
                case 4: // Right
                    x = halfSize + (Math.random() - 0.5) * variance;
                    y = (Math.random() * 2 - 1) * halfSize;
                    z = (Math.random() * 2 - 1) * halfSize;
                    break;
                case 5: // Left
                    x = -halfSize + (Math.random() - 0.5) * variance;
                    y = (Math.random() * 2 - 1) * halfSize;
                    z = (Math.random() * 2 - 1) * halfSize;
                    break;
            }

            positions.push(x, y, z);

            // Create subtle blue-white gradient
            const distanceFromCenter = Math.sqrt(x*x + y*y + z*z) / halfSize;
            const intensity = Math.max(0.2, 1 - distanceFromCenter);
            
            // Blue-tinted white color
            colors.push(
                intensity * 0.8, // R
                intensity * 0.8, // G
                intensity * 0.9  // B
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.size * 0.003,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        this.points.add(points);
    }

    getPoints() {
        return this.points;
    }
}