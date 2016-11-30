function SceneManager() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.textures = null;
    this.floor = null;
    this.cube = null;
    this.ambient_light = new THREE.AmbientLight( 0x404040 );
    this.point_light_one = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 100});
    this.point_light_two = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 100});
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

            instance.floor = new Floor(10000, 10000, [0, 0, 0], instance.textures['floor']);
            instance.cube = new Cube(50, 50, 50, [-300, 25, 0], instance.textures['cannon']);
            instance.point_light_one.position.set(
                instance.floor.x - 300, instance.floor.y + 300, instance.floor.z + 500
            );
            instance.point_light_two.position.set(
                instance.floor.x + 300, instance.floor.y + 300, instance.floor.z + 500
            );
            instance.floor.add_to_scene(instance.scene);
            instance.cube.add_to_scene(instance.scene);
            instance.scene.add(instance.point_light_one);
            instance.scene.add(instance.point_light_two);
            instance.scene.add(instance.ambient_light);

            callback();
        });
    })(this);
};

