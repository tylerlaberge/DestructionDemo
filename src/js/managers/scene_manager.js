function SceneManager() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.textures = null;
    this.floor = null;
    this.sphere = null;
    this.cannon = null;
    this.ambient_light = new THREE.AmbientLight( 0x404040 );
    this.point_light_one = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
    this.point_light_two = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
    this.point_light_three = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});

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

            instance.floor = new Floor(20, 50, [0, 0, 0], instance.textures['wood_floor']);
            instance.cannon = new Cannon(.31, 1.3, 15, [-9, 0.62 + instance.floor.thickness/2, 5], instance.textures['cannon']);
            instance.sphere = new Sphere(0.30, [-7.7, 1 + instance.floor.thickness/2, 5], instance.textures['cannon']);

            instance.cannon.rotate(0, 90, 0);
            instance.point_light_one.position.set(-9, 2, 5);
            instance.point_light_two.position.set(1.5, 2, 5);
            instance.point_light_three.position.set(12, 2, 5);

            instance.floor.add_to_scene(instance.scene);
            instance.floor.add_to_world(instance.world);

            instance.cannon.add_to_scene(instance.scene);
            instance.scene.add(instance.point_light_one);
            instance.scene.add(instance.point_light_two);
            instance.scene.add(instance.point_light_three);
            instance.scene.add(instance.ambient_light);

            window.addEventListener('mousedown', function () {
                instance.sphere.add_to_scene(instance.scene);
                instance.sphere.add_to_world(instance.world);
            });

            callback();
        });
    })(this);
};
SceneManager.prototype.update_physics = function () {
    this.world.step(1.0/60.0);
    this.floor.update_mesh();
    this.sphere.update_mesh();
};

