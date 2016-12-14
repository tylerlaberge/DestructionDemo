window.SCENE_MODULE = (function () {
    /*
     * A module containing scenes to be used by the App.
     */

    //private module members
    var scene = new THREE.Scene();

    var world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    var textures = null;

    //private module method
    function load_textures(callback) {
        window.load_textures(function (textures_map) {
            textures = textures_map;
            callback();
        });
    }
    function MainScene() {
        /*
         * A Class responsible for creating and maintaining the models of the main scene.
         */

        //public members
        this.models = {
            'floor': null,
            'cannon': null,
            'cannonball': null,
            'pallet': null,
            'debris': null
        };
        this.lights = {
            'ambient_light': null,
            'point_light_one': null,
            'point_light_two': null,
            'point_light_three': null

        };

        //private instance member
        var that = this;

        //private method
        function __init_models() {
            /*
             * Create and position the models of this Scene.
             */
            that.models['floor'] = new MODELS_MODULE.Floor(20, 100, textures['wood_floor']);
            that.models['cannon'] = new MODELS_MODULE.Cannon(.31, 1.3, 15, textures['cannon']);
            that.models['cannonball'] = new MODELS_MODULE.Cannonball(0.30, textures['cannon']);
            that.models['pallet'] = new MODELS_MODULE.Pallet(2, 2.90, textures['wood_pallet']);
            that.models['debris'] = [];

            that.models['floor'].set_position(0, 0, 0);
            that.models['cannon'].set_position(-9, 0.62 + that.models['floor'].thickness / 2, 5);
            that.models['cannonball'].set_position(-7.7, 1 + that.models['floor'].thickness / 2, 5);
            that.models['pallet'].set_position(1.5, 1.5 + that.models['floor'].thickness / 2, 5);

            that.models['cannon'].set_rotation(0, 90, 0);
            that.models['pallet'].set_rotation(0, -90, 0);

            that.models['cannonball'].set_velocity(
                200 * Math.cos(degrees_to_radians(90 - 15)), 3 * Math.sin(degrees_to_radians(90 - 15)), 0
            );
        }

        //private method
        function __init_lights() {
            /*
             * Create and position the lights of this Scene.
             */
            that.lights['ambient_light'] = new THREE.AmbientLight(0x404040);
            that.lights['point_light_one'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
            that.lights['point_light_two'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
            that.lights['point_light_three'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});

            that.lights['point_light_one'].position.set(-9, 2, 5);
            that.lights['point_light_two'].position.set(1.5, 2, 5);
            that.lights['point_light_three'].position.set(30, 2, 5);
        }

        //privileged method
        this.build = function (callback) {
            /*
             * Build the scene.
             *
             * Creates all models and lights in the MainScene and adds them to the modules scene.
             *
             * @param callback: A function to call when the scene is finished building.
             */
            (function (instance) {
                load_textures(function () {
                    //When the textures are finished loading, continue building.
                    __init_models();
                    __init_lights();

                    instance.models['floor'].add_to_scene(scene);
                    instance.models['cannon'].add_to_scene(scene);
                    instance.models['pallet'].add_to_scene(scene);

                    instance.models['floor'].add_to_world(world);
                    instance.models['pallet'].add_to_world(world);

                    scene.add(instance.lights['point_light_one']);
                    scene.add(instance.lights['point_light_two']);
                    scene.add(instance.lights['point_light_three']);
                    scene.add(instance.lights['ambient_light']);

                    instance.models['pallet'].body.addEventListener('collide', function (event) {
                        /*
                         * On pallet collision with the cannonball, replace the pallet with debris from the destroyed pallet.
                         */
                        if (event.body.id == instance.models['cannonball'].body.id) {
                            var debris = instance.models['pallet'].destroy();
                            instance.models['pallet'].remove_from_scene(scene);
                            instance.models['pallet'].remove_from_world(world);
                            for (var i = 0; i < debris.length; i++) {
                                instance.models['debris'].push(debris[i]);
                                debris[i].add_to_scene(scene);
                                debris[i].add_to_world(world);
                                debris[i].body.applyImpulse(new CANNON.Vec3(30, 0, 0), debris[i].body.position);
                            }
                        }
                    });

                    window.addEventListener('keydown', function (event) {
                        /*
                         * On spacebar press, fire the cannonball.
                         */
                        if (event.keyCode == 32) {
                            instance.models['cannonball'].add_to_scene(scene);
                            instance.models['cannonball'].add_to_world(world);
                        }
                    });
                    callback();
                });
            })(this);
        };
    }
    MainScene.prototype.update_physics = function(){
        /*
         * Update the physics of every model in the scene.
         *
         * Should be called in the render loop.
         */
        world.step(1.0/70.0);
        for(var key in this.models) {
            if (this.models.hasOwnProperty(key)) {
                if (this.models[key] != null){
                    if (Array.isArray(this.models[key])){
                        for (var i = 0; i < this.models[key].length; i++) {
                            this.models[key][i].update_physics();
                        }
                    }
                    else{
                        this.models[key].update_physics();
                    }
                }
            }
        }
    };
    MainScene.prototype.reset = function () {
        /*
         * Reset the scene.
         */
        this.models['cannonball'].remove_from_scene(scene);
        this.models['pallet'].remove_from_scene(scene);

        this.models['cannonball'].remove_from_world(world);
        this.models['pallet'].remove_from_world(world);

        for (var i = 0; i < this.models['debris'].length; i++) {
            this.models['debris'][i].remove_from_scene(scene);
            this.models['debris'][i].remove_from_world(world);
        }

        this.models['cannonball'] = new MODELS_MODULE.Cannonball(0.30, textures['cannon']);
        this.models['pallet'] = new MODELS_MODULE.Pallet(2, 2.90, textures['wood_pallet']);
        this.models['debris'] = [];

        this.models['cannonball'].set_position(-7.7, 1 + this.models['floor'].thickness/2, 5);
        this.models['pallet'].set_position(1.5, 1.5 + this.models['floor'].thickness/2, 5);

        this.models['pallet'].set_rotation(0, -90, 0);

        this.models['cannonball'].set_velocity(
            200*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
        );

        this.models['pallet'].add_to_scene(scene);
        this.models['pallet'].add_to_world(world);

        (function(instance){
            instance.models['pallet'].body.addEventListener('collide', function (event) {
                if (event.body.id == instance.models['cannonball'].body.id) {
                    var debris = instance.models['pallet'].destroy();
                    instance.models['pallet'].remove_from_scene(scene);
                    instance.models['pallet'].remove_from_world(world);
                    for (var i = 0; i < debris.length; i++) {
                        instance.models['debris'].push(debris[i]);
                        debris[i].add_to_scene(scene);
                        debris[i].add_to_world(world);
                        debris[i].body.applyImpulse(new CANNON.Vec3(30, 0, 0), debris[i].body.position);
                    }
                }
            });
        })(this);
        this.update_physics();
    };
    MainScene.prototype.get_scene = function () {
        /*
         * Get the module level scene that this MainScene uses.
         *
         * @return: The scene that this MainScene uses. (THREE.Scene)
         */
        return scene;
    };
    return {
        MainScene: MainScene
    }
})();