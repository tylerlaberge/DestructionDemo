function Scene() {
    /*
     * A class responsible for scene operations.
     */
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.textures = null;
    this.graphics = {
        'floor': null,
        'cannon': null,
        'cannonball': null,
        'pallet': null,
        'debris': []
    };
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

            instance.graphics['floor'] = new Floor(20, 50, instance.textures['wood_floor']);
            instance.graphics['cannon'] = new Cannon(.31, 1.3, 15, instance.textures['cannon']);
            instance.graphics['cannonball'] = new Cannonball(0.30, instance.textures['cannon']);
            instance.graphics['pallet'] = new Pallet(2, 2.90, instance.textures['wood_pallet']);

            instance.graphics['floor'].set_position(0, 0, 0);
            instance.graphics['cannon'].set_position(-9, 0.62 + instance.graphics['floor'].thickness/2, 5);
            instance.graphics['cannonball'].set_position(-7.7, 1 + instance.graphics['floor'].thickness/2, 5);
            instance.graphics['pallet'].set_position(1.5, 1.5 + instance.graphics['floor'].thickness/2, 5);

            instance.graphics['cannon'].set_rotation(0, 90, 0);
            instance.graphics['pallet'].set_rotation(0, -90, 0);

            instance.graphics['cannonball'].set_velocity(
                100*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
            );

            instance.point_light_one.position.set(-9, 2, 5);
            instance.point_light_two.position.set(1.5, 2, 5);
            instance.point_light_three.position.set(12, 2, 5);

            instance.graphics['floor'].add_to_scene(instance.scene);
            instance.graphics['cannon'].add_to_scene(instance.scene);
            instance.graphics['pallet'].add_to_scene(instance.scene);

            instance.graphics['floor'].add_to_world(instance.world);
            instance.graphics['pallet'].add_to_world(instance.world);

            instance.scene.add(instance.point_light_one);
            instance.scene.add(instance.point_light_two);
            instance.scene.add(instance.point_light_three);
            instance.scene.add(instance.ambient_light);

            instance.graphics['pallet'].body.addEventListener('collide', function (event) {
                if (event.body.id == instance.graphics['cannonball'].body.id) {
                    var debris = instance.graphics['pallet'].destroy();
                    instance.graphics['pallet'].remove_from_scene(instance.scene);
                    instance.graphics['pallet'].remove_from_world(instance.world);
                    for (var i = 0; i < debris.length; i++) {
                        instance.graphics['debris'].push(debris[i]);
                        debris[i].add_to_scene(instance.scene);
                        debris[i].add_to_world(instance.world);
                        debris[i].body.applyImpulse(new CANNON.Vec3(10, 0, 0), debris[i].body.position);
                    }
                }
            });

            window.addEventListener('keydown', function (event) {
                if (event.keyCode == 32) {
                    instance.graphics['cannonball'].add_to_scene(instance.scene);
                    instance.graphics['cannonball'].add_to_world(instance.world);
                }
            });
            callback();
        });
    })(this);
};
Scene.prototype.update_physics = function () {
    this.world.step(1.0/60.0);
    for(var key in this.graphics) {
        if (this.graphics.hasOwnProperty(key)) {
            if (this.graphics[key] != null){
                if (Array.isArray(this.graphics[key])){
                    for (var i = 0; i < this.graphics[key].length; i++) {
                        this.graphics[key][i].update_physics();
                    }
                }
                else{
                    this.graphics[key].update_physics();
                }
            }
        }
    }
};
Scene.prototype.reset = function () {
    this.graphics['cannonball'].remove_from_scene(this.scene);
    this.graphics['pallet'].remove_from_scene(this.scene);

    this.graphics['cannonball'].remove_from_world(this.world);
    this.graphics['pallet'].remove_from_world(this.world);

    for (var i = 0; i < this.graphics['debris'].length; i++) {
        this.graphics['debris'][i].remove_from_scene(this.scene);
        this.graphics['debris'][i].remove_from_world(this.world);
    }

    this.graphics['cannonball'] = new Cannonball(0.30, this.textures['cannon']);
    this.graphics['pallet'] = new Pallet(2, 2.90, this.textures['wood_pallet']);
    this.graphics['debris'] = [];

    this.graphics['cannonball'].set_position(-7.7, 1 + this.graphics['floor'].thickness/2, 5);
    this.graphics['pallet'].set_position(1.5, 1.5 + this.graphics['floor'].thickness/2, 5);

    this.graphics['pallet'].set_rotation(0, -90, 0);

    this.graphics['cannonball'].set_velocity(
        100*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
    );

    this.graphics['pallet'].add_to_scene(this.scene);
    this.graphics['pallet'].add_to_world(this.world);

    (function(instance){
        instance.graphics['pallet'].body.addEventListener('collide', function (event) {
            if (event.body.id == instance.graphics['cannonball'].body.id) {
                var debris = instance.graphics['pallet'].destroy();
                instance.graphics['pallet'].remove_from_scene(instance.scene);
                instance.graphics['pallet'].remove_from_world(instance.world);
                for (var i = 0; i < debris.length; i++) {
                    instance.graphics['debris'].push(debris[i]);
                    debris[i].add_to_scene(instance.scene);
                    debris[i].add_to_world(instance.world);
                    debris[i].body.applyImpulse(new CANNON.Vec3(10, 0, 0), debris[i].body.position);
                }
            }
        });
    })(this);
    this.update_physics();
};


