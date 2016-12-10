function Pallet(width, height, texture){
    this.width = width;
    this.height = height;
    this.texture = texture;

    this.beam_thickness = .125;
    this.beam_width = .25;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    this.__init();
}
Pallet.prototype = Object.create(Graphic.prototype);
Pallet.prototype.__init = function () {
    this.geometry = this.__build_pallet();
    this.material = new THREE.MeshLambertMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.body = new CANNON.Body({
        mass: 5,
        type: CANNON.Body.DYNAMIC,
        shape: new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.beam_thickness*2))
    });

    Graphic.call(this, this.geometry, this.material, this.mesh, this.body);
};
Pallet.prototype.__build_pallet = function () {
    var pallet = new THREE.Geometry();

    for(var i = -1; i <= 1; i++) {
        var beam_geometry = new THREE.BoxGeometry(this.beam_width, this.height, this.beam_thickness*2, 1, 1, 1);
        var beam_mesh = new THREE.Mesh(beam_geometry);

        beam_mesh.rotateY(degrees_to_radians(90));
        beam_mesh.position.set(i*(this.beam_width/2 - this.width/2), 0, 0);

        beam_mesh.updateMatrix();
        pallet.merge(beam_mesh.geometry, beam_mesh.matrix);
    }
    for(var j = -1; j <= 1; j++) {
        var beam_two_geometry = new THREE.BoxGeometry(this.width, this.beam_width, this.beam_thickness, 1, 1, 1);
        var beam_two_mesh = new THREE.Mesh(beam_two_geometry);

        beam_two_mesh.position.set(0, j*(this.beam_width/2 - this.height/2), -this.beam_thickness);

        beam_two_mesh.updateMatrix();
        pallet.merge(beam_two_mesh.geometry, beam_two_mesh.matrix);
    }
    for(var k = 0; k < this.height/(1.5*this.beam_width); k++) {
        var beam_three_geometry = new THREE.BoxGeometry(this.width, this.beam_width, this.beam_thickness, 1, 1, 1);
        var beam_three_mesh = new THREE.Mesh(beam_three_geometry);

        beam_three_mesh.position.set(0, (k*(1.5*this.beam_width)) - this.height/2 + this.beam_width/2, this.beam_thickness);

        beam_three_mesh.updateMatrix();
        pallet.merge(beam_three_mesh.geometry, beam_three_mesh.matrix);
    }
    return pallet;
};



