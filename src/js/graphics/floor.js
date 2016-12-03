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

    this.init();
}
Floor.prototype.init = function () {
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;

    this.mesh.rotateX(degrees_to_radians(-90));
};
Floor.prototype.add_to_scene = function (scene) {
    scene.add(this.mesh);
};