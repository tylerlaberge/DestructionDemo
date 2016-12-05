function Cannon(barrel_radius, barrel_length, barrel_rotation, texture) {
    this.barrel_radius = barrel_radius;
    this.barrel_length = barrel_length;
    this.barrel_rotation = barrel_rotation;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.__init();
}
Cannon.prototype = Object.create(Graphic.prototype);
Cannon.prototype.__init = function () {
    this.geometry = this.__build_cannon();
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    Graphic.call(this, this.geometry, this.material, this.mesh);
};
Cannon.prototype.__build_cannon = function () {
    var cannon = new THREE.Geometry();

    var base = this.__build_base();
    var barrel = this.__build_barrel();

    base.updateMatrix();
    barrel.updateMatrix();

    cannon.merge(base.geometry, base.matrix);
    cannon.merge(barrel.geometry, barrel.matrix);

    return cannon;
};
Cannon.prototype.__build_base = function () {
    var base_geometry = new THREE.Geometry();

    var right_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius*2, this.barrel_length/2);
    var left_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius*2, this.barrel_length/2);
    var connector_geomerty = new THREE.BoxGeometry(this.barrel_radius*3, this.barrel_radius/5, this.barrel_length/2);

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
    var tube_base_geometry = new THREE.SphereGeometry(
        this.barrel_radius, 100, 100
    );
    var tube_end_geometry = new THREE.TorusGeometry(
        this.barrel_radius, .05, 100, 100
    );

    var tube_mesh = new THREE.Mesh(tube_geometry);
    var tube_base_mesh = new THREE.Mesh(tube_base_geometry);
    var tube_end_mesh = new THREE.Mesh(tube_end_geometry);

    tube_mesh.position.set(0, 0, 0);
    tube_mesh.rotateX(degrees_to_radians(90 - this.barrel_rotation));

    var y2 = Math.cos(degrees_to_radians(90 - this.barrel_rotation)) * this.barrel_length;
    var z2 = Math.sin(degrees_to_radians(90 - this.barrel_rotation)) * this.barrel_length;

    tube_mesh.position.set(0, y2/2, z2/2);
    tube_base_mesh.position.set(0, 0, 0);
    tube_end_mesh.position.set(0, 0, 0);
    tube_end_mesh.rotateX(degrees_to_radians(180 - this.barrel_rotation));
    tube_end_mesh.position.set(0, y2, z2);

    tube_mesh.updateMatrix();
    tube_base_mesh.updateMatrix();
    tube_end_mesh.updateMatrix();

    barrel_geometry.merge(tube_mesh.geometry, tube_mesh.matrix);
    barrel_geometry.merge(tube_base_mesh.geometry, tube_base_mesh.matrix);
    barrel_geometry.merge(tube_end_mesh.geometry, tube_end_mesh.matrix);

    return new THREE.Mesh(barrel_geometry);
};