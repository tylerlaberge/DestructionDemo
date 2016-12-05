function Floor(length, width, texture) {
    this.length = length;
    this.width = width;
    this.thickness = .5;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    this.__init();
}
Floor.prototype = Object.create(Graphic.prototype);
Floor.prototype.__init = function () {
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(10, 10);

    this.geometry = new THREE.BoxGeometry(this.width, this.length, this.thickness);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotateX(degrees_to_radians(-90));

    this.body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(25, 10, .25))
    });
    Graphic.call(this, this.geometry, this.material, this.mesh, this.body);
};