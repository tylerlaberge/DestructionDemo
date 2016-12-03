function Cannon(barrel_radius, barrel_length, barrel_rotation, center_vertex, texture) {
    this.barrel_radius = barrel_radius;
    this.barrel_length = barrel_length;
    this.barrel_rotation = barrel_rotation;
    this.x = center_vertex[0];
    this.y = center_vertex[1];
    this.z = center_vertex[2];
    this.texture = texture;

    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});

    this.base = this.__build_base();
    this.barrel = this.__build_barrel();

    this.geometry = new THREE.Geometry();

    this.base.updateMatrix();
    this.barrel.updateMatrix();

    this.geometry.merge(this.base.geometry, this.base.matrix);
    this.geometry.merge(this.barrel.geometry, this.barrel.matrix);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
}
Cannon.prototype.rotate = function (x, y, z) {
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotateX(degrees_to_radians(x));
    this.mesh.rotateY(degrees_to_radians(y));
    this.mesh.rotateZ(degrees_to_radians(z));
    this.mesh.position.set(this.x, this.y, this.z);
};
Cannon.prototype.__build_base = function () {
    var base_geometry = new THREE.Geometry();

    var right_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius*2, this.barrel_length/2);
    var left_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius*2, this.barrel_length/2);
    var connector_geomerty = new THREE.BoxGeometry(this.barrel_radius * 3, this.barrel_radius/5, this.barrel_length/2);

    var left_leg_mesh = new THREE.Mesh(left_leg_geometry);
    var right_leg_mesh = new THREE.Mesh(right_leg_geometry);
    var connector_mesh = new THREE.Mesh(connector_geomerty);

    left_leg_mesh.position.set(-(1.5*this.barrel_radius), -this.barrel_radius, 0);
    right_leg_mesh.position.set((1.5*this.barrel_radius), -this.barrel_radius, 0);
    connector_mesh.position.set(0, -(1.25*this.barrel_radius), 0);

    left_leg_mesh.updateMatrix();
    right_leg_mesh.updateMatrix();
    connector_mesh.updateMatrix();

    base_geometry.merge(left_leg_mesh.geometry, left_leg_mesh.matrix);
    base_geometry.merge(right_leg_mesh.geometry, right_leg_mesh.matrix);
    base_geometry.merge(connector_mesh.geometry, connector_mesh.matrix);

    return new THREE.Mesh(base_geometry);
};
Cannon.prototype.__build_barrel = function () {
    var barrel_geometry = new THREE.Geometry();

    var tube_geometry = new THREE.CylinderGeometry(
        this.barrel_radius, this.barrel_radius, this.barrel_length, 100, 100, true
    );
    var tube_end_geometry = new THREE.SphereGeometry(
        this.barrel_radius, 100, 100
    );

    var tube_mesh = new THREE.Mesh(tube_geometry);
    var tube_end_mesh = new THREE.Mesh(tube_end_geometry);

    tube_mesh.position.set(0, 0, 0);
    tube_mesh.rotateX(degrees_to_radians(90 - this.barrel_rotation));

    var y2 = Math.cos(degrees_to_radians(90 - this.barrel_rotation)) * this.barrel_length;
    var z2 = Math.sin(degrees_to_radians(90 - this.barrel_rotation)) * this.barrel_length;

    tube_mesh.position.set(0, y2/2, z2/2);
    tube_end_mesh.position.set(0, 0, 0);

    tube_mesh.updateMatrix();
    tube_end_mesh.updateMatrix();

    barrel_geometry.merge(tube_mesh.geometry, tube_mesh.matrix);
    barrel_geometry.merge(tube_end_mesh.geometry, tube_end_mesh.matrix);

    return new THREE.Mesh(barrel_geometry);
};
Cannon.prototype.add_to_scene = function (scene) {
    scene.add(this.mesh);
};