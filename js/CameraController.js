import * as THREE from 'three';

class CameraController {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.cameraTarget = new THREE.Vector3(0, 50, 0);
        
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        
        this.addEventListeners();
    }
    
    addEventListeners() {
        this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.domElement.addEventListener('wheel', this.onWheel.bind(this));
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    onMouseDown(event) {
        if (event.button === 0) {
            this.isLeftMouseDown = true;
        } else if (event.button === 2) {
            this.isRightMouseDown = true;
        }
        this.prevMouseX = event.clientX;
        this.prevMouseY = event.clientY;
    }
    
    onMouseUp(event) {
        if (event.button === 0) {
            this.isLeftMouseDown = false;
        } else if (event.button === 2) {
            this.isRightMouseDown = false;
        }
    }
    
    onMouseMove(event) {
        if (this.isLeftMouseDown) {
            const deltaX = (event.clientX - this.prevMouseX) * 0.01;
            const deltaY = (event.clientY - this.prevMouseY) * 0.01;
            
            const offset = this.camera.position.clone().sub(this.cameraTarget);
            offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), -deltaX);
            offset.applyAxisAngle(new THREE.Vector3(1, 0, 0), -deltaY);
            this.camera.position.copy(this.cameraTarget).add(offset);
            this.camera.lookAt(this.cameraTarget);
        }
        
        if (this.isRightMouseDown) {
            const deltaX = (event.clientX - this.prevMouseX) * 0.01;
            const deltaY = (event.clientY - this.prevMouseY) * 0.01;
            
            this.camera.position.x -= deltaX;
            this.camera.position.y += deltaY;
            this.cameraTarget.x -= deltaX;
            this.cameraTarget.y += deltaY;
            this.camera.lookAt(this.cameraTarget);
        }
        
        this.prevMouseX = event.clientX;
        this.prevMouseY = event.clientY;
    }
    
    onWheel(event) {
        event.preventDefault();
        const zoomSpeed = 0.001;
        this.camera.position.z += event.deltaY * zoomSpeed;
        this.camera.position.z = Math.max(1, Math.min(20, this.camera.position.z));
        this.camera.lookAt(this.cameraTarget);
    }
    
    update() {
        // For continuous updates if needed
    }
}

export { CameraController };