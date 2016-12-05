function Cannonball(radius, texture){
    this.radius = radius;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    this.__init();
}
Cannonball.prototype = Object.create(Graphic.prototype);
Cannonball.prototype.__init = function () {
    this.geometry = new THREE.SphereGeometry(this.radius, 100, 100);
    this.material = new THREE.MeshPhongMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.body = new CANNON.Body({
        mass: 15,
        type: CANNON.Body.DYNAMIC,
        shape: new CANNON.Sphere(this.radius)
    });

    Graphic.call(this, this.geometry, this.material, this.mesh, this.body);
};



