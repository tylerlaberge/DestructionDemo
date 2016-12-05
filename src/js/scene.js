function Scene() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.textures = null;
    this.floor = null;
    this.cannonball = null;
    this.cannon = null;
    this.pallet = null;
    this.ambient_light = new THREE.AmbientLight( 0x404040 );
    this.point_light_one = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
    this.point_light_two = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
    this.point_light_three = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});

}
Scene.prototype.build = function (callback) {
    /*
     * Builds the scene.
     *
     * @param callback: A function to call when the scene is finished building.
     */
    (function (instance) {
        window.load_textures(function (textures) {
            instance.textures = textures;

            instance.floor = new Floor(20, 50, instance.textures['wood_floor']);
            instance.cannon = new Cannon(.31, 1.3, 15, instance.textures['cannon']);
            instance.cannonball = new Cannonball(0.30, instance.textures['cannon']);
            instance.pallet = new Pallet(2, 2.90, instance.textures['wood_pallet']);

            instance.floor.set_position(0, 0, 0);
            instance.cannon.set_position(-9, 0.62 + instance.floor.thickness/2, 5);
            instance.cannonball.set_position(-7.7, 1 + instance.floor.thickness/2, 5);
            instance.pallet.set_position(1.5, 1.5 + instance.floor.thickness/2, 5);

            instance.cannon.set_rotation(0, 90, 0);
            instance.pallet.set_rotation(0, -90, 0);

            instance.cannonball.set_velocity(
                100*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
            );

            instance.point_light_one.position.set(-9, 2, 5);
            instance.point_light_two.position.set(1.5, 2, 5);
            instance.point_light_three.position.set(12, 2, 5);

            instance.floor.add_to_scene(instance.scene);
            instance.cannon.add_to_scene(instance.scene);
            instance.pallet.add_to_scene(instance.scene);

            instance.floor.add_to_world(instance.world);
            instance.pallet.add_to_world(instance.world);

            instance.scene.add(instance.point_light_one);
            instance.scene.add(instance.point_light_two);
            instance.scene.add(instance.point_light_three);
            instance.scene.add(instance.ambient_light);

            window.addEventListener('keydown', function (event) {
                if (event.keyCode == 32) {
                    instance.cannonball.add_to_scene(instance.scene);
                    instance.cannonball.add_to_world(instance.world);
                }
            });

            callback();
        });
    })(this);
};
Scene.prototype.update_physics = function () {
    this.world.step(1.0/60.0);
    this.floor.update_physics();
    this.cannonball.update_physics();
    this.pallet.update_physics();
};
Scene.prototype.reset = function () {
    this.cannonball.remove_from_scene(this.scene);
    this.pallet.remove_from_scene(this.scene);

    this.cannonball.remove_from_world(this.world);
    this.pallet.remove_from_world(this.world);

    this.cannonball = new Cannonball(0.30, this.textures['cannon']);
    this.pallet = new Pallet(2, 2.90, this.textures['wood_pallet']);

    this.cannonball.set_position(-7.7, 1 + this.floor.thickness/2, 5);
    this.pallet.set_position(1.5, 1.5 + this.floor.thickness/2, 5);

    this.pallet.set_rotation(0, -90, 0);

    this.cannonball.set_velocity(
        100*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
    );

    this.pallet.add_to_scene(this.scene);
    this.pallet.add_to_world(this.world);

    this.update_physics();
};

