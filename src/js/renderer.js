function Renderer(width, height, scene, camera) {
    /*
     * A class for managing rendering operations.
     *
     * @param width: The width to render. (int)
     * @param height: The height to render. (int)
     * @param scene_manager: The scene_manager containing scenes to render. (SceneManager)
     * @param camera_manager: The camera_manager containing cameras to render. (CameraManager)
     */
    this.renderer = new THREE.WebGLRenderer();
    this.width = width;
    this.height = height;
    this.scene = scene;
    this.camera = camera;
    this.init();
}
Renderer.prototype.init = function () {
    /*
     * Initialize this object.
     */
    this.renderer.setSize(this.width, this.height);
    document.body.appendChild(this.renderer.domElement);
};
Renderer.prototype.render = function () {
    /*
     * Render the scene.
     */
    var instance = this;
    requestAnimationFrame(function() {
        instance.render();
    });
    this.scene.update_physics();
    this.renderer.render(this.scene.scene, this.camera.camera);
};
