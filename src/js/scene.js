window.SCENE_MODULE = (function () {
    var scene = new THREE.Scene();

    var world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    var textures = null;

    function load_textures(callback) {
        window.load_textures(function (textures_map) {
            textures = textures_map;
            callback();
        });
    }
    function MainScene() {
        this.graphics = {
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
        var that = this;
        function __init_graphics() {
            that.graphics['floor'] = new MODELS_MODULE.Floor(20, 50, textures['wood_floor']);
            that.graphics['cannon'] = new MODELS_MODULE.Cannon(.31, 1.3, 15, textures['cannon']);
            that.graphics['cannonball'] = new MODELS_MODULE.Cannonball(0.30, textures['cannon']);
            that.graphics['pallet'] = new MODELS_MODULE.Pallet(2, 2.90, textures['wood_pallet']);
            that.graphics['debris'] = [];

            that.graphics['floor'].set_position(0, 0, 0);
            that.graphics['cannon'].set_position(-9, 0.62 + that.graphics['floor'].thickness / 2, 5);
            that.graphics['cannonball'].set_position(-7.7, 1 + that.graphics['floor'].thickness / 2, 5);
            that.graphics['pallet'].set_position(1.5, 1.5 + that.graphics['floor'].thickness / 2, 5);

            that.graphics['cannon'].set_rotation(0, 90, 0);
            that.graphics['pallet'].set_rotation(0, -90, 0);

            that.graphics['cannonball'].set_velocity(
                100 * Math.cos(degrees_to_radians(90 - 15)), 3 * Math.sin(degrees_to_radians(90 - 15)), 0
            );
        }
        function __init_lights() {
            that.lights['ambient_light'] = new THREE.AmbientLight(0x404040);
            that.lights['point_light_one'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
            that.lights['point_light_two'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});
            that.lights['point_light_three'] = new THREE.PointLight({color: 0xffffff, intensity: 1, distance: 10});

            that.lights['point_light_one'].position.set(-9, 2, 5);
            that.lights['point_light_two'].position.set(1.5, 2, 5);
            that.lights['point_light_three'].position.set(12, 2, 5);
        }
        this.build = function (callback) {
            /*
             * Builds the scene.
             *
             * @param callback: A function to call when the scene is finished building.
             */
            (function (instance) {
                load_textures(function () {
                    __init_graphics();
                    __init_lights();

                    instance.graphics['floor'].add_to_scene(scene);
                    instance.graphics['cannon'].add_to_scene(scene);
                    instance.graphics['pallet'].add_to_scene(scene);

                    instance.graphics['floor'].add_to_world(world);
                    instance.graphics['pallet'].add_to_world(world);

                    scene.add(instance.lights['point_light_one']);
                    scene.add(instance.lights['point_light_two']);
                    scene.add(instance.lights['point_light_three']);
                    scene.add(instance.lights['ambient_light']);

                    instance.graphics['pallet'].body.addEventListener('collide', function (event) {
                        if (event.body.id == instance.graphics['cannonball'].body.id) {
                            var debris = instance.graphics['pallet'].destroy();
                            instance.graphics['pallet'].remove_from_scene(scene);
                            instance.graphics['pallet'].remove_from_world(world);
                            for (var i = 0; i < debris.length; i++) {
                                instance.graphics['debris'].push(debris[i]);
                                debris[i].add_to_scene(scene);
                                debris[i].add_to_world(world);
                                debris[i].body.applyImpulse(new CANNON.Vec3(10, 0, 0), debris[i].body.position);
                            }
                        }
                    });

                    window.addEventListener('keydown', function (event) {
                        if (event.keyCode == 32) {
                            instance.graphics['cannonball'].add_to_scene(scene);
                            instance.graphics['cannonball'].add_to_world(world);
                        }
                    });
                    callback();
                });
            })(this);
        };
    }
    MainScene.prototype.update_physics = function(){
        world.step(1.0/65.0);
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
    MainScene.prototype.reset = function () {
        this.graphics['cannonball'].remove_from_scene(scene);
        this.graphics['pallet'].remove_from_scene(scene);

        this.graphics['cannonball'].remove_from_world(world);
        this.graphics['pallet'].remove_from_world(world);

        for (var i = 0; i < this.graphics['debris'].length; i++) {
            this.graphics['debris'][i].remove_from_scene(scene);
            this.graphics['debris'][i].remove_from_world(world);
        }

        this.graphics['cannonball'] = new MODELS_MODULE.Cannonball(0.30, textures['cannon']);
        this.graphics['pallet'] = new MODELS_MODULE.Pallet(2, 2.90, textures['wood_pallet']);
        this.graphics['debris'] = [];

        this.graphics['cannonball'].set_position(-7.7, 1 + this.graphics['floor'].thickness/2, 5);
        this.graphics['pallet'].set_position(1.5, 1.5 + this.graphics['floor'].thickness/2, 5);

        this.graphics['pallet'].set_rotation(0, -90, 0);

        this.graphics['cannonball'].set_velocity(
            100*Math.cos(degrees_to_radians(90 - 15)), 3*Math.sin(degrees_to_radians(90 - 15)), 0
        );

        this.graphics['pallet'].add_to_scene(scene);
        this.graphics['pallet'].add_to_world(world);

        (function(instance){
            instance.graphics['pallet'].body.addEventListener('collide', function (event) {
                if (event.body.id == instance.graphics['cannonball'].body.id) {
                    var debris = instance.graphics['pallet'].destroy();
                    instance.graphics['pallet'].remove_from_scene(scene);
                    instance.graphics['pallet'].remove_from_world(world);
                    for (var i = 0; i < debris.length; i++) {
                        instance.graphics['debris'].push(debris[i]);
                        debris[i].add_to_scene(scene);
                        debris[i].add_to_world(world);
                        debris[i].body.applyImpulse(new CANNON.Vec3(10, 0, 0), debris[i].body.position);
                    }
                }
            });
        })(this);
        this.update_physics();
    };
    MainScene.prototype.get_scene = function () {
        return scene;
    };
    return {
        MainScene: MainScene
    }
})();



