function SceneManager() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.textures = null;
    this.floor = null;
    this.sphere = null;
    this.cannon = null;
    this.ambient_light = new THREE.AmbientLight( 0x404040 );
    this.point_light_one = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
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

            instance.floor = new Floor(20, 20, [0, 0, 0], instance.textures['wood_floor']);
            instance.sphere = new Sphere(0.30, [-1, 0.30 + instance.floor.thickness/2, 9], instance.textures['cannon']);
            instance.cannon = new Cannon(.30, 1.5, [0, 0.60 + instance.floor.thickness/2, 9], instance.textures['cannon']);
            instance.point_light_one.position.set(-1, 2, 7);
            instance.floor.add_to_scene(instance.scene);
            instance.sphere.add_to_scene(instance.scene);
            instance.cannon.add_to_scene(instance.scene);
            instance.scene.add(instance.point_light_one);
            instance.scene.add(instance.ambient_light);

            callback();
        });
    })(this);
};

