import * as THREE from 'three';

export class TreePointCloud {
    constructor(params = {}) {
        this.params = {
            height: params.height || 10,
            radiusBase: params.radiusBase || 1,
            branchLevels: params.branchLevels || 4,
            pointsPerLevel: params.pointsPerLevel || 1000,
            colorVariation: params.colorVariation || 0.2,
            baseColor: new THREE.Color(params.baseColor || 0x228B22)
        };

        this.points = new THREE.Group();
        this.generateTree();
    }

    generateTree() {
        // 1. Generate Trunk Points:
        this.generateTrunkPoints();

        // 2. Generate Branches and Foliage:
        for (let level = 1; level <= this.params.branchLevels; level++) {
            // Create branches at this level
            const branchAngle = (Math.random() - 0.5) * Math.PI / 4; // Random angle for each branch
            const branchDirection = new THREE.Vector3(Math.cos(branchAngle), 0, Math.sin(branchAngle));
            this.generateBranchPoints(level, branchDirection); 
        }
    }
    
    generateTrunkPoints() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const pointCount = Math.floor(this.params.pointsPerLevel / 2);

        for (let i = 0; i < pointCount; i++) {
            const heightPercent = Math.random();
            const angle = Math.random() * Math.PI * 2;
            const radius = this.params.radiusBase * (1 - heightPercent * 0.7);

            const x = Math.cos(angle) * radius;
            const y = heightPercent * this.params.height * 0.4;
            const z = Math.sin(angle) * radius;

            positions.push(x, y, z);

            // Color variation for trunk (darker brown)
            const color = new THREE.Color(0x4B3621);
            color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.params.boundarySize * 0.002,
            vertexColors: true,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        this.points.add(points);
    }

    generateBranchPoints(level, branchDirection) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const pointCount = this.params.pointsPerLevel;

        const startHeight = this.params.height * 0.3;
        const heightRange = this.params.height - startHeight;
        const levelHeight = startHeight + (heightRange * (level / this.params.branchLevels));

        for (let i = 0; i < pointCount; i++) {
            // 1. Branch Point Placement:
            const angle = Math.random() * Math.PI * 2; 
            const branchRadius = this.params.radiusBase * (1 - level / this.params.branchLevels) * 2; // Taper branches
            const branchPoint = new THREE.Vector3(
                branchRadius * Math.cos(angle),
                levelHeight + (Math.random() - 0.5) * heightRange * 0.1, // Vertical variation
                branchRadius * Math.sin(angle)
            );

            // 2. Rotate Around Trunk:
            branchPoint.applyAxisAngle(new THREE.Vector3(0, 1, 0), branchDirection.z);

            // 3. Foliage Clustering:
            const foliageRadius = 0.2 * (this.params.branchLevels - level + 1); // Adjust for desired size
            const foliageOffset = new THREE.Vector3(
                (Math.random() - 0.5) * foliageRadius,
                (Math.random() - 0.5) * foliageRadius,
                (Math.random() - 0.5) * foliageRadius
            );
            const pointPosition = branchPoint.clone().add(foliageOffset);

            positions.push(pointPosition.x, pointPosition.y, pointPosition.z);
            // Color variation (greener for leaves)
            const color = this.params.baseColor.clone();
            color.offsetHSL(
                (Math.random() - 0.5) * this.params.colorVariation,
                (Math.random() - 0.5) * this.params.colorVariation,
                (Math.random() - 0.5) * this.params.colorVariation
            );
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true
        });

        const points = new THREE.Points(geometry, material);
        this.points.add(points);
    }

    getPoints() {
        return this.points;
    }

    animate() {
        // Optional: Add subtle movement animation
        this.points.children.forEach((points, i) => {
            const positions = points.geometry.attributes.position.array;
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += Math.sin(Date.now() * 0.001 + i) * 0.001;
                positions[j + 2] += Math.cos(Date.now() * 0.001 + i) * 0.001;
            }
            points.geometry.attributes.position.needsUpdate = true;
        });
    }
}
