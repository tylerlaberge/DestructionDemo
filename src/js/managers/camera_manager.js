function CameraManager(width, height) {
    /*
     * A class responsible for managing camera operations.
     *
     * @param width: The width for cameras to use. (int)
     * @param height: The height for cameras to use. (int)
     */
    this.width = width;
    this.height = height;
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
}
CameraManager.prototype.set_position = function(x, y, z) {
    this.camera.position.set(x, y, z);
};
CameraManager.prototype.look_at = function (x, y, z) {
    this.camera.lookAt(new THREE.Vector3(x, y, z));
};