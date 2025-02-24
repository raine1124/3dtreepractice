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
        this.createTrunk();
        this.createBranches();
        this.createLeaves();
    }

    createTrunk() {
        const trunkGeometry = new THREE.BufferGeometry();
        const trunkPositions = [];
        const trunkColors = [];

        const trunkSegments = 20; 
        const trunkRadiusVariation = 0.2;

        for (let segment = 0; segment < trunkSegments; segment++) {
            const segmentHeight = segment / trunkSegments;
            const segmentRadius = this.params.radiusBase * (1 - segmentHeight * 0.7)
                                 * (1 + (Math.random() - 0.5) * trunkRadiusVariation); 

            for (let i = 0; i < this.params.pointsPerLevel; i++) {
                const angle = (i / this.params.pointsPerLevel) * Math.PI * 2;
                const x = segmentRadius * Math.cos(angle) + (Math.random() - 0.5) * 0.1; 
                const y = segmentHeight * this.params.height;
                const z = segmentRadius * Math.sin(angle) + (Math.random() - 0.5) * 0.1; 

                trunkPositions.push(x, y, z);

                const color = new THREE.Color(0x4B3621); 
                color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
                trunkColors.push(color.r, color.g, color.b);
            }
        }

        trunkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trunkPositions, 3));
        trunkGeometry.setAttribute('color', new THREE.Float32BufferAttribute(trunkColors, 3));

        const trunkMaterial = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true
        });

        const trunkPoints = new THREE.Points(trunkGeometry, trunkMaterial);
        this.points.add(trunkPoints);
    }

    createBranches() {
        const branchGeometry = new THREE.BufferGeometry();
        const branchPositions = [];
        const branchColors = [];

        const numBranches = this.params.branchLevels * this.params.pointsPerLevel;
        const branchRadiusVariation = 0.15; 

        for (let i = 0; i < numBranches; i++) {
            // 1. Branching Point on Trunk
            const trunkHeight = Math.random(); // Position on trunk (0 = bottom, 1 = top)
            const trunkRadius = this.params.radiusBase * (1 - trunkHeight * 0.7); 
            const branchAngle = Math.random() * Math.PI * 2; // Angle around the trunk
            const branchStartX = trunkRadius * Math.cos(branchAngle);
            const branchStartY = trunkHeight * this.params.height; 
            const branchStartZ = trunkRadius * Math.sin(branchAngle);

            // 2. Branch Length and Direction 
            const branchLength = (1 - trunkHeight) * this.params.height * 0.5 * (Math.random() + 0.5); // Shorter at top
            const branchDirectionX = Math.random() - 0.5; 
            const branchDirectionZ = Math.random() - 0.5;
            const branchDirectionY = -Math.random();

            // Normalize direction vector (important for consistent branch thickness)
            const directionMagnitude = Math.sqrt(branchDirectionX * branchDirectionX + 
                                                branchDirectionY * branchDirectionY + 
                                                branchDirectionZ * branchDirectionZ);
            const normalizedX = branchDirectionX / directionMagnitude;
            const normalizedY = branchDirectionY / directionMagnitude;
            const normalizedZ = branchDirectionZ / directionMagnitude;

            // 3. Points along Branch
            const branchSegments = 10;
            for (let j = 0; j < branchSegments; j++) {
                const segmentPosition = j / branchSegments; 
                const segmentRadius = 0.02 * (1 - segmentPosition) *  // Tapering
                                      (1 + (Math.random() - 0.5) * branchRadiusVariation); 

                const x = branchStartX + normalizedX * branchLength * segmentPosition + 
                          (Math.random() - 0.5) * 0.05; // Add slight noise for texture
                const y = branchStartY + normalizedY * branchLength * segmentPosition;
                const z = branchStartZ + normalizedZ * branchLength * segmentPosition + 
                          (Math.random() - 0.5) * 0.05;  

                branchPositions.push(x, y, z);

                // Branch Color (similar variation to the trunk)
                const color = new THREE.Color(0x3D2B1F); 
                color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.15); 
                branchColors.push(color.r, color.g, color.b);
            }
        }

        branchGeometry.setAttribute('position', new THREE.Float32BufferAttribute(branchPositions, 3));
        branchGeometry.setAttribute('color', new THREE.Float32BufferAttribute(branchColors, 3));

        const branchMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true 
        });

        const branchPoints = new THREE.Points(branchGeometry, branchMaterial);
        this.points.add(branchPoints); 
    }

    createLeaves() { 
        const leafGeometry = new THREE.BufferGeometry();
        const leafPositions = [];
        const leafColors = [];

        const numLeafClusters = this.params.branchLevels * this.params.pointsPerLevel / 2; 

        for (let i = 0; i < numLeafClusters; i++) {
            // 1. Random Point on a Branch (reusing some branch logic)
            const trunkHeight = Math.random(); 
            const trunkRadius = this.params.radiusBase * (1 - trunkHeight * 0.7);
            const branchAngle = Math.random() * Math.PI * 2; 
            const branchStartX = trunkRadius * Math.cos(branchAngle);
            const branchStartY = trunkHeight * this.params.height;
            const branchStartZ = trunkRadius * Math.sin(branchAngle);

            const branchLength = (1 - trunkHeight) * this.params.height * 0.5 * (Math.random() + 0.5); 
            const branchDirectionX = Math.random() - 0.5;
            const branchDirectionZ = Math.random() - 0.5;
            const branchDirectionY = -Math.random() * 0.5; 

            const directionMagnitude = Math.sqrt(branchDirectionX * branchDirectionX +
                branchDirectionY * branchDirectionY +
                branchDirectionZ * branchDirectionZ);
            const normalizedX = branchDirectionX / directionMagnitude;
            const normalizedY = branchDirectionY / directionMagnitude;
            const normalizedZ = branchDirectionZ / directionMagnitude;


            const leafClusterPosition = Math.random(); 

            const clusterCenterX = branchStartX + normalizedX * branchLength * leafClusterPosition;
            const clusterCenterY = branchStartY + normalizedY * branchLength * leafClusterPosition;
            const clusterCenterZ = branchStartZ + normalizedZ * branchLength * leafClusterPosition;

            // 2. Leaf Points around Cluster Center 
            const clusterRadius = Math.random() * 0.3 + 0.1; // Vary cluster size
            const pointsPerCluster = 20; 

            for (let j = 0; j < pointsPerCluster; j++) {
                const leafAngle = Math.random() * Math.PI * 2;
                const leafDistance = Math.random() * clusterRadius;

                const x = clusterCenterX + leafDistance * Math.cos(leafAngle) + (Math.random() - 0.5) * 0.1;
                const y = clusterCenterY + leafDistance * Math.sin(leafAngle) + (Math.random() - 0.5) * 0.1;
                const z = clusterCenterZ + (Math.random() - 0.5) * 0.1; 

                leafPositions.push(x, y, z);

                // 3. Leaf Color Variation 
                const color = new THREE.Color(this.params.baseColor); 
                color.offsetHSL(
                    (Math.random() - 0.5) * this.params.colorVariation * 0.5, // Less hue variation
                    (Math.random() - 0.5) * this.params.colorVariation,
                    (Math.random() - 0.5) * this.params.colorVariation * 0.3 // Less lightness variation
                );
                leafColors.push(color.r, color.g, color.b);
            }
        }

        leafGeometry.setAttribute('position', new THREE.Float32BufferAttribute(leafPositions, 3));
        leafGeometry.setAttribute('color', new THREE.Float32BufferAttribute(leafColors, 3));

        const leafMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true 
        });

        const leafPoints = new THREE.Points(leafGeometry, leafMaterial);
        this.points.add(leafPoints);
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