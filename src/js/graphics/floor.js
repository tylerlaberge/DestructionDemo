function Floor(length, width, initial_position, texture) {
    this.length = length;
    this.width = width;
    this.thickness = .5;
    this.initial_position = initial_position;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    this.__init();
}
Floor.prototype = Object.create(Graphic.prototype);
Floor.prototype.__init = function () {
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(10, 10);

    this.geometry = new THREE.BoxGeometry(this.width, this.length, this.thickness);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.initial_position[0], this.initial_position[1], this.initial_position[2]);
    this.mesh.rotateX(degrees_to_radians(-90));

    this.body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(25, 10, .25))
    });
    this.body.position.copy(this.mesh.position);
    this.body.quaternion.copy(this.mesh.quaternion);

    this.update_physics();

    Graphic.call(this, this.geometry, this.material, this.mesh);
};
Floor.prototype.update_physics = function () {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
};
Floor.prototype.add_to_world = function (world) {
    world.addBody(this.body);
};