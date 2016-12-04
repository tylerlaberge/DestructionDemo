function Pallet(width, height, center, texture){
    this.width = width;
    this.height = height;
    this.texture = texture;

    this.material = new THREE.MeshLambertMaterial({color: 0x0000ff, side: THREE.DoubleSide});
    this.mesh = this.__build_pallet();
    this.mesh.position.set(center[0], center[1], center[2]);
    this.mesh.rotateY(degrees_to_radians(180));
}
Pallet.prototype.__build_pallet = function () {
    var pallet = new THREE.Geometry();

    for(var i = -1; i <= 1; i++) {
        var beam_geometry = new THREE.BoxGeometry(.25, this.height, .25, 100, 100, 100);
        var beam_mesh = new THREE.Mesh(beam_geometry);

        beam_mesh.rotateY(degrees_to_radians(90));
        beam_mesh.position.set(i*(.125- this.width/2), 0, 0);

        beam_mesh.updateMatrix();
        pallet.merge(beam_mesh.geometry, beam_mesh.matrix);
    }
    for(var i = -1; i <= 1; i++) {
        var beam_geometry = new THREE.BoxGeometry(this.width, .25, .125, 100, 100, 100);
        var beam_mesh = new THREE.Mesh(beam_geometry);

        beam_mesh.position.set(0, i*(.125 - this.height/2), .125 + .0625);

        beam_mesh.updateMatrix();
        pallet.merge(beam_mesh.geometry, beam_mesh.matrix);
    }
    for(var i = -2; i <= 2; i++) {
        var beam_geometry = new THREE.BoxGeometry(this.width, .25, .125, 100, 100, 100);
        var beam_mesh = new THREE.Mesh(beam_geometry);

        beam_mesh.position.set(0, i*(.125 - this.height/4), .125 - .0625);

        beam_mesh.updateMatrix();
        pallet.merge(beam_mesh.geometry, beam_mesh.matrix);
    }

    return new THREE.Mesh(pallet, this.material);
};
Pallet.prototype.add_to_scene = function (scene) {
    scene.add(this.mesh);
};



