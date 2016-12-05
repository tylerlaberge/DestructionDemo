function Pallet(width, height, texture){
    this.width = width;
    this.height = height;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.__init();
}
Pallet.prototype = Object.create(Graphic.prototype);
Pallet.prototype.__init = function () {
    this.geometry = this.__build_pallet();
    this.material = new THREE.MeshLambertMaterial({map: this.texture, side: THREE.DoubleSide});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    Graphic.call(this, this.geometry, this.material, this.mesh);
};
Pallet.prototype.__build_pallet = function () {
    var pallet = new THREE.Geometry();

    for(var i = -1; i <= 1; i++) {
        var beam_geometry = new THREE.BoxGeometry(.25, this.height, .25, 10, 10, 10);
        var beam_mesh = new THREE.Mesh(beam_geometry);

        beam_mesh.rotateY(degrees_to_radians(90));
        beam_mesh.position.set(i*(.125- this.width/2), 0, 0);

        beam_mesh.updateMatrix();
        pallet.merge(beam_mesh.geometry, beam_mesh.matrix);
    }
    for(var j = -1; j <= 1; j++) {
        var beam_two_geometry = new THREE.BoxGeometry(this.width, .25, .125, 100, 100, 100);
        var beam_two_mesh = new THREE.Mesh(beam_two_geometry);

        beam_two_mesh.position.set(0, j*(.125 - this.height/2), -.125);

        beam_two_mesh.updateMatrix();
        pallet.merge(beam_two_mesh.geometry, beam_two_mesh.matrix);
    }
    for(var k = 0; k < this.height/.375; k++) {
        var beam_three_geometry = new THREE.BoxGeometry(this.width, .25, .125, 10, 10, 10);
        var beam_three_mesh = new THREE.Mesh(beam_three_geometry);

        beam_three_mesh.position.set(0, (k*.375) - this.height/2 + .125, .125);

        beam_three_mesh.updateMatrix();
        pallet.merge(beam_three_mesh.geometry, beam_three_mesh.matrix);
    }
    return pallet;
};



