function Graphic(geometry, material, mesh) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
}
Graphic.prototype.get_position = function () {
    return this.mesh.position;
};
Graphic.prototype.get_rotation = function () {
    return this.mesh.rotation;
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


