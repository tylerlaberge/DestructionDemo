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
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);

    //this.camera.position.set(initial_position[0], initial_position[1], initial_position[2]);
  //  this.camera.rotateX(degrees_to_radians(-10));
    this.camera.position.set(0, .5, 15);
    this.camera.lookAt(new THREE.Vector3(0, .25, 0));
}