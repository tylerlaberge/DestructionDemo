function Cannon(barrel_radius, barrel_length, center_vertex, texture) {
    this.barrel_radius = barrel_radius;
    this.barrel_length = barrel_length;
    this.x = center_vertex[0];
    this.y = center_vertex[1];
    this.z = center_vertex[2];
    this.texture = texture;

    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.base = this.__build_base();

}
Cannon.prototype.__build_base = function () {
    var base = new THREE.Object3D();
    var connector = new THREE.Object3D();
    var left_leg = new THREE.Object3D();
    var right_leg = new THREE.Object3D();

    var right_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius, this.barrel_length/2);
    var left_leg_geometry = new THREE.BoxGeometry(this.barrel_radius/2, this.barrel_radius, this.barrel_length/2);
    var connector_geomerty = new THREE.BoxGeometry(this.barrel_radius * 2, this.barrel_radius/10, this.barrel_length/2);

    var left_leg_mesh = new THREE.Mesh(left_leg_geometry, this.material);
    var right_leg_mesh = new THREE.Mesh(right_leg_geometry, this.material);
    var connector_mesh = new THREE.Mesh(connector_geomerty, this.material);

    left_leg_mesh.position.set(this.x - this.barrel_radius, this.y - this.barrel_radius, this.z - this.barrel_length/4);
    right_leg_mesh.position.set(this.x + this.barrel_radius, this.y - this.barrel_radius, this.z - this.barrel_length/4);
    connector_mesh.position.set(this.x, this.y - (this.barrel_radius + this.barrel_radius/4), this.z - this.barrel_length/4);

    connector.add(connector_mesh);
    left_leg.add(left_leg_mesh);
    right_leg.add(right_leg_mesh);

    connector.add(left_leg);
    connector.add(right_leg);

    base.add(connector);

    return base;

};
Cannon.prototype.add_to_scene = function (scene) {
    scene.add(this.base);
};