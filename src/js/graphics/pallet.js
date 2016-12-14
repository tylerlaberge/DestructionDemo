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

    var support_beams = this.__build_support_beams();
    var back_beams = this.__build_back_beams();
    var front_beams = this.__build_front_beams();

    var beams = [].concat(support_beams, back_beams, front_beams);
    for(var i = 0; i < beams.length; i++) {
        pallet.merge(beams[i].geometry, beams[i].matrix);
    }

    return pallet;
};
Pallet.prototype.destroy = function () {
    var support_beam_debris = this.__get_support_beam_debris();
    var back_beam_debris = this.__get_back_beam_debris();
    var front_beam_debris = this.__get_front_beam_debris();

    var debris = [].concat(support_beam_debris, back_beam_debris, front_beam_debris);
    for(var j = 0; j < debris.length; j++) {
        debris[j].geometry.computeBoundingBox();
        var bounding_box = debris[j].geometry.boundingBox;

        debris[j] = new Graphic(
            debris[j].geometry, debris[j].material, debris[j],
            new CANNON.Body(
                {
                    mass: 1,
                    type: CANNON.Body.DYNAMIC,
                    shape: new CANNON.Box(
                        new CANNON.Vec3(
                            (bounding_box.max.x - bounding_box.min.x)/2,
                            (bounding_box.max.y - bounding_box.min.y)/2,
                            (bounding_box.max.z - bounding_box.min.z)/2
                        )
                    )
                }
            ));
        debris[j].update_body();
    }
    return debris;
};
Pallet.prototype.__build_support_beams = function () {
    var beams = [];
    for(var i = -1; i <= 1; i++) {
        var beam_mesh = this.__build_support_beam();
        beam_mesh.position.set(i*(this.beam_width/2 - this.width/2), 0, 0);
        beam_mesh.updateMatrix();
        beams.push(beam_mesh);
    }
    return beams;
};
Pallet.prototype.__build_back_beams = function () {
    var beams = [];
    for(var i = -1; i <= 1; i++) {

        var beam_half_one_mesh = this.__build_cross_beam_half();
        var beam_half_two_mesh = this.__build_cross_beam_half();

        beam_half_one_mesh.position.set(-this.width/4, i*(this.beam_width/2 - this.height/2), -this.beam_thickness);
        beam_half_two_mesh.position.set(this.width/4, i*(this.beam_width/2 - this.height/2), -this.beam_thickness);

        beam_half_one_mesh.updateMatrix();
        beam_half_two_mesh.updateMatrix();

        beams.push(beam_half_one_mesh, beam_half_two_mesh);
    }
    return beams;
};
Pallet.prototype.__build_front_beams = function () {
    var beams = [];
    for(var k = 0; k < this.height/(1.5*this.beam_width); k++) {
        var beam_half_one_mesh = this.__build_cross_beam_half();
        var beam_half_two_mesh = this.__build_cross_beam_half();

        beam_half_one_mesh.position.set(
            -this.width/4, (k*(1.5*this.beam_width)) - this.height/2 + this.beam_width/2, this.beam_thickness
        );
        beam_half_two_mesh.position.set(
            this.width/4, (k*(1.5*this.beam_width)) - this.height/2 + this.beam_width/2, this.beam_thickness
        );

        beam_half_one_mesh.updateMatrix();
        beam_half_two_mesh.updateMatrix();

        beams.push(beam_half_one_mesh, beam_half_two_mesh);
    }
    return beams;
};
Pallet.prototype.__build_support_beam = function () {
    return new THREE.Mesh(
        new THREE.BoxGeometry(this.beam_width, this.height, this.beam_thickness*2),
        this.material
    );
};
Pallet.prototype.__build_cross_beam_half = function () {
    return new THREE.Mesh(
        new THREE.BoxGeometry(this.width/2, this.beam_width, this.beam_thickness/2),
        this.material
    );
};
Pallet.prototype.__get_support_beam_debris = function () {
    var debris = this.__build_support_beams();
    for(var i = 0; i < debris.length; i++) {
        debris[i].position.set(
            this.get_position().x,
            this.get_position().y,
            this.get_position().z
        );
        debris[i].rotation.set(this.get_rotation().x, this.get_rotation().y, this.get_rotation().z);
        debris[i].translateX(i*this.width/2 - this.width/2);
    }
    return debris;
};
Pallet.prototype.__get_back_beam_debris = function () {
    var debris = this.__build_back_beams();
    for(var i = 0; i < debris.length; i+=2) {
        debris[i].position.set(
            this.get_position().x,
            this.get_position().y,
            this.get_position().z
        );
        debris[i+1].position.set(
            this.get_position().x,
            this.get_position().y,
            this.get_position().z
        );
        debris[i].rotation.set(this.get_rotation().x, this.get_rotation().y, this.get_rotation().z);
        debris[i+1].rotation.set(this.get_rotation().x, this.get_rotation().y, this.get_rotation().z);

        debris[i].translateX(-this.beam_width*2);
        debris[i].translateY(((i/2)*(this.beam_width/2 - this.height/2) - (this.beam_width/2 - this.height/2)));
        debris[i].translateZ(-this.beam_thickness*2);
        debris[i+1].translateX(this.beam_width*2);
        debris[i+1].translateY(((i/2)*(this.beam_width/2 - this.height/2) - (this.beam_width/2 - this.height/2)));
        debris[i+1].translateZ(-this.beam_thickness*2);
    }
    return debris;
};
Pallet.prototype.__get_front_beam_debris = function () {
    var debris = this.__build_front_beams();
    for(var i = 0; i < debris.length; i+=2) {
        debris[i].position.set(
            this.get_position().x,
            this.get_position().y,
            this.get_position().z
        );
        debris[i+1].position.set(
            this.get_position().x,
            this.get_position().y,
            this.get_position().z
        );
        debris[i].rotation.set(this.get_rotation().x, this.get_rotation().y, this.get_rotation().z);
        debris[i+1].rotation.set(this.get_rotation().x, this.get_rotation().y, this.get_rotation().z);

        debris[i].translateX(-this.beam_width*2);
        debris[i].translateY(((i/2)*(1.5*this.beam_width) - this.height/2 + this.beam_width/2));
        debris[i].translateZ(this.beam_thickness*2);
        debris[i+1].translateX(this.beam_width*2);
        debris[i+1].translateY(((i/2)*(1.5*this.beam_width) - this.height/2 + this.beam_width/2));
        debris[i+1].translateZ(this.beam_thickness*2);
    }
    return debris;
};



