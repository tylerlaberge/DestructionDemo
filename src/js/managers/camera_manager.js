function CameraManager(width, height, initial_position) {
    /*
     * A class responsible for managing camera operations.
     *
     * @param width: The width for cameras to use. (int)
     * @param height: The height for cameras to use. (int)
     * @param initial_position: The initial position of the camera. [x, y, z]
     */
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);

    this.camera.position.x = initial_position[0];
    this.camera.position.y = initial_position[1];
    this.camera.position.z = initial_position[2];

    this.camera.rotateX(degrees_to_radians(-10));
}