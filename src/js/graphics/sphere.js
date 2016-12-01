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

    this.mesh.position.x = center[0];
    this.mesh.position.y = center[1];
    this.mesh.position.z = center[2];

    this.mesh.rotateY(30);
}
Sphere.prototype.add_to_scene = function (scene) {
    /*
     * Add this sphere to a scene.
     *
     * @param scene: The scene to add this sphere to. (THREE.Scene)
     */
    scene.add(this.mesh);
};



