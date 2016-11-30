function SceneManager() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.textures = null;
    this.ambient_light = new THREE.AmbientLight( 0x404040 );
    this.point_light = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 2000});
}
SceneManager.prototype.build_scene = function (callback) {
    /*
     * Builds the scene.
     *
     * @param callback: A function to call when the scene is finished building.
     */
    (function (instance) {
        window.load_textures(function (textures) {
            instance.textures = textures;
            instance.scene.add(instance.point_light);
            instance.scene.add(instance.ambient_light);
            callback();
        });
    })(this);
};

