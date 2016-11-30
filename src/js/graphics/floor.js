function Floor(length, width, center_vertex, texture) {
    this.length = length;
    this.width = width;
    this.x = center_vertex[0];
    this.y = center_vertex[1];
    this.z = center_vertex[2];
    this.texture = texture;

    this.geometry = new THREE.PlaneGeometry(this.width, this.length);
    this.material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x009900, shininess: 30, side: THREE.DoubleSide});
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