function Cannonball(radius, initial_position, texture){
    this.radius = radius;
    this.initial_position = initial_position;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    this.__init();
}
Cannonball.prototype = Object.create(Graphic.prototype);
Cannonball.prototype.__init = function () {
    this.geometry = new THREE.SphereGeometry(this.radius, 100, 100);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    var velocity_x = 100*Math.cos(degrees_to_radians(90 - 15));
    var velocity_y = 3*Math.sin(degrees_to_radians(90 - 15));

    this.body = new CANNON.Body({
        mass: 15,
        position: new CANNON.Vec3(this.initial_position[0], this.initial_position[1], this.initial_position[2]),
        velocity: new CANNON.Vec3(velocity_x, velocity_y, 0),
        type: CANNON.Body.DYNAMIC,
        shape: new CANNON.Sphere(this.radius)
    });

    Graphic.call(this, this.geometry, this.material, this.mesh);
};
Cannonball.prototype.update_physics = function () {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
};
Cannonball.prototype.add_to_world = function (world) {
    world.addBody(this.body);
};



