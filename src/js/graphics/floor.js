function Floor(length, width, center_vertex, texture) {
    this.length = length;
    this.width = width;
    this.thickness = .5;
    this.x = center_vertex[0];
    this.y = center_vertex[1];
    this.z = center_vertex[2];
    this.texture = texture;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(10, 10);

    this.geometry = new THREE.BoxGeometry(this.width, this.length, this.thickness);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.body = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.depth/2))
    });

    this.init();
}
Floor.prototype.init = function () {
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;

    this.mesh.rotateX(degrees_to_radians(-90));

    this.update_body();
    this.update_mesh();
};
Floor.prototype.update_body = function () {
    this.body.position.x = this.mesh.position.x;
    this.body.position.y = this.mesh.position.y;
    this.body.position.z = this.mesh.position.z;

    this.body.quaternion.x = this.mesh.quaternion.x;
    this.body.quaternion.y = this.mesh.quaternion.y;
    this.body.quaternion.z = this.mesh.quaternion.z;
};
Floor.prototype.update_mesh = function () {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
};
Floor.prototype.add_to_scene = function (scene) {
    scene.add(this.mesh);
};
Floor.prototype.add_to_world = function (world) {
    world.addBody(this.body);
};