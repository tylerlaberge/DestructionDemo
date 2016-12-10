function Graphic(geometry, material, mesh, body) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
    this.body = body;
}
Graphic.prototype.get_position = function () {
    return this.mesh.position;
};
Graphic.prototype.get_rotation = function () {
    return this.mesh.rotation;
};
Graphic.prototype.get_velocity = function () {
    return this.body.velocity;
};
Graphic.prototype.set_position = function (x, y, z) {
    this.mesh.position.set(x, y, z);
    if (this.body != null) {
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);
        this.update_physics();
    }
};
Graphic.prototype.set_rotation = function (x, y, z) {
    this.mesh.rotation.set(degrees_to_radians(x), degrees_to_radians(y), degrees_to_radians(z));
    if (this.body != null) {
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);
        this.update_physics();
    }
};
Graphic.prototype.set_velocity = function (i, j, k) {
    this.body.velocity.set(i, j, k);
};
Graphic.prototype.rotateX = function (degrees) {
    this.mesh.rotateX(degrees_to_radians(degrees));
};
Graphic.prototype.rotateY = function (degrees) {
    this.mesh.rotateY(degrees_to_radians(degrees));
};
Graphic.prototype.rotateZ = function (degrees) {
    this.mesh.rotateZ(degrees_to_radians(degrees));
};
Graphic.prototype.translateX = function (distance) {
    this.mesh.translateX(distance);
};
Graphic.prototype.translateY = function (distance) {
    this.mesh.translateY(distance);
};
Graphic.prototype.translateZ = function (distance) {
    this.mesh.translateZ(distance);
};
Graphic.prototype.add_to_scene = function (scene) {
    scene.add(this.mesh);
};
Graphic.prototype.add_to_world = function (world) {
    if (this.body != null) {
        world.addBody(this.body);
    }
};
Graphic.prototype.remove_from_scene = function (scene) {
    scene.remove(this.mesh);
};
Graphic.prototype.remove_from_world = function (world) {
    if (this.body != null) {
        world.removeBody(this.body);
    }
};
Graphic.prototype.update_physics = function () {
    if (this.body != null) {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
};
Graphic.prototype.update_body = function () {
    if (this.body != null) {
        this.body.position.copy(this.mesh.position);
        this.body.quaternion.copy(this.mesh.quaternion);
    }
};


