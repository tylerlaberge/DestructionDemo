GRAPHIC_MODULE.Pallet = (function () {
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

        var that = this;
        function __init() {
            that.geometry = __build_pallet();
            that.material = new THREE.MeshLambertMaterial({map: that.texture, side: THREE.DoubleSide});
            that.mesh = new THREE.Mesh(that.geometry, that.material);

            that.body = new CANNON.Body({
                mass: 5,
                type: CANNON.Body.DYNAMIC,
                shape: new CANNON.Box(new CANNON.Vec3(that.width/2, that.height/2, that.beam_thickness*2))
            });

            GRAPHIC_MODULE.Graphic.call(that, that.geometry, that.material, that.mesh, that.body);
        }
        function __build_pallet() {
            var pallet = new THREE.Geometry();

            var support_beams = __build_support_beams();
            var back_beams = __build_back_beams();
            var front_beams = __build_front_beams();

            var beams = [].concat(support_beams, back_beams, front_beams);
            for(var i = 0; i < beams.length; i++) {
                pallet.merge(beams[i].geometry, beams[i].matrix);
            }

            return pallet;
        }
        function __build_support_beams() {
            var beams = [];
            for(var i = -1; i <= 1; i++) {
                var beam_mesh = __build_support_beam();
                beam_mesh.position.set(i*(that.beam_width/2 - that.width/2), 0, 0);
                beam_mesh.updateMatrix();
                beams.push(beam_mesh);
            }
            return beams;
        }
        function __build_back_beams() {
            var beams = [];
            for(var i = -1; i <= 1; i++) {

                var beam_half_one_mesh = __build_cross_beam_half();
                var beam_half_two_mesh = __build_cross_beam_half();

                beam_half_one_mesh.position.set(-that.width/4, i*(that.beam_width/2 - that.height/2), -that.beam_thickness);
                beam_half_two_mesh.position.set(that.width/4, i*(that.beam_width/2 - that.height/2), -that.beam_thickness);

                beam_half_one_mesh.updateMatrix();
                beam_half_two_mesh.updateMatrix();

                beams.push(beam_half_one_mesh, beam_half_two_mesh);
            }
            return beams;
        }
        function __build_front_beams() {
            var beams = [];
            for(var k = 0; k < that.height/(1.5*that.beam_width); k++) {
                var beam_half_one_mesh = __build_cross_beam_half();
                var beam_half_two_mesh = __build_cross_beam_half();

                beam_half_one_mesh.position.set(
                    -that.width/4, (k*(1.5*that.beam_width)) - that.height/2 + that.beam_width/2, that.beam_thickness
                );
                beam_half_two_mesh.position.set(
                    that.width/4, (k*(1.5*that.beam_width)) - that.height/2 + that.beam_width/2, that.beam_thickness
                );

                beam_half_one_mesh.updateMatrix();
                beam_half_two_mesh.updateMatrix();

                beams.push(beam_half_one_mesh, beam_half_two_mesh);
            }
            return beams;
        }
        function __build_support_beam() {
            return new THREE.Mesh(
                new THREE.BoxGeometry(that.beam_width, that.height, that.beam_thickness*2),
                that.material
            );
        }
        function __build_cross_beam_half() {
            return new THREE.Mesh(
                new THREE.BoxGeometry(that.width/2, that.beam_width, that.beam_thickness/2),
                that.material
            );
        }
        function __get_support_beam_debris() {
            var debris = __build_support_beams();
            for(var i = 0; i < debris.length; i++) {
                debris[i].position.set(
                    that.get_position().x,
                    that.get_position().y,
                    that.get_position().z
                );
                debris[i].rotation.set(that.get_rotation().x, that.get_rotation().y, that.get_rotation().z);
                debris[i].translateX(i*that.width/2 - that.width/2);
            }
            return debris;
        }
        function __get_back_beam_debris() {
            var debris = __build_back_beams();
            for(var i = 0; i < debris.length; i+=2) {
                debris[i].position.set(
                    that.get_position().x,
                    that.get_position().y,
                    that.get_position().z
                );
                debris[i+1].position.set(
                    that.get_position().x,
                    that.get_position().y,
                    that.get_position().z
                );
                debris[i].rotation.set(that.get_rotation().x, that.get_rotation().y, that.get_rotation().z);
                debris[i+1].rotation.set(that.get_rotation().x, that.get_rotation().y, that.get_rotation().z);

                debris[i].translateX(-that.beam_width*2);
                debris[i].translateY(((i/2)*(that.beam_width/2 - that.height/2) - (that.beam_width/2 - that.height/2)));
                debris[i].translateZ(-that.beam_thickness*2);
                debris[i+1].translateX(that.beam_width*2);
                debris[i+1].translateY(((i/2)*(that.beam_width/2 - that.height/2) - (that.beam_width/2 - that.height/2)));
                debris[i+1].translateZ(-that.beam_thickness*2);
            }
            return debris;
        }
        function __get_front_beam_debris() {
            var debris = __build_front_beams();
            for(var i = 0; i < debris.length; i+=2) {
                debris[i].position.set(
                    that.get_position().x,
                    that.get_position().y,
                    that.get_position().z
                );
                debris[i+1].position.set(
                    that.get_position().x,
                    that.get_position().y,
                    that.get_position().z
                );
                debris[i].rotation.set(that.get_rotation().x, that.get_rotation().y, that.get_rotation().z);
                debris[i+1].rotation.set(that.get_rotation().x, that.get_rotation().y, that.get_rotation().z);

                debris[i].translateX(-that.beam_width*2);
                debris[i].translateY(((i/2)*(1.5*that.beam_width) - that.height/2 + that.beam_width/2));
                debris[i].translateZ(that.beam_thickness*2);
                debris[i+1].translateX(that.beam_width*2);
                debris[i+1].translateY(((i/2)*(1.5*that.beam_width) - that.height/2 + that.beam_width/2));
                debris[i+1].translateZ(that.beam_thickness*2);
            }
            return debris;
        }
        this.destroy = function () {
            var support_beam_debris = __get_support_beam_debris();
            var back_beam_debris = __get_back_beam_debris();
            var front_beam_debris = __get_front_beam_debris();

            var debris = [].concat(support_beam_debris, back_beam_debris, front_beam_debris);
            for(var j = 0; j < debris.length; j++) {
                debris[j].geometry.computeBoundingBox();
                var bounding_box = debris[j].geometry.boundingBox;

                debris[j] = new GRAPHIC_MODULE.Graphic(
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
        __init();
    }
    Pallet.prototype = Object.create(GRAPHIC_MODULE.Graphic.prototype);
    return Pallet;
})();



