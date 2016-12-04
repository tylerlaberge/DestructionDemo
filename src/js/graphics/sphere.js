function Sphere(radius, center, texture){
    /*
     * A class which wraps the creation of a spheres geometry, material, and mesh.
     *
     * @param radius: The radius of the sphere. (int)
     * @param center: The center vertex of the sphere. [x, y, z]
     * @param texture: The texture to apply to the sphere (THREE.Texture)
     */
    this.radius = radius;
    this.texture = texture;

    this.geometry = new THREE.SphereGeometry(this.radius, 100, 100);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    var velocity_x = 50*Math.cos(degrees_to_radians(90 - 15));
    var velocity_y = Math.sin(degrees_to_radians(90 - 15));

    this.body = new CANNON.Body({
        mass: 15,
        position: new CANNON.Vec3(center[0], center[1], center[2]),
        velocity: new CANNON.Vec3(velocity_x, velocity_y, 0),
        type: CANNON.Body.DYNAMIC,
        shape: new CANNON.Sphere(this.radius)
    });
}
Sphere.prototype.update_mesh = function () {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
};
Sphere.prototype.add_to_scene = function (scene) {
    /*
     * Add this sphere to a scene.
     *
     * @param scene: The scene to add this sphere to. (THREE.Scene)
     */
    scene.add(this.mesh);
};
Sphere.prototype.add_to_world = function (world) {
    world.addBody(this.body);
};



