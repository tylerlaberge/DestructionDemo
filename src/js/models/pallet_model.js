MODELS_MODULE.Pallet = function(width, height, texture){
    /*
     * A Class for representing and manipulating a model which represents a Pallet.
     *
     * @param width: The width of this Pallet. (Number)
     * @param height: The height of this Pallet. (Number)
     * @param texture: The texture to apply to the material of this Pallet.
     * @inherits: MODELS_MODULE.Model
     */

    //public members
    this.width = width;
    this.height = height;
    this.texture = texture;

    this.beam_thickness = .125;
    this.beam_width = .25;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
         * Initialize the geometry, material, mesh, and body of this Pallet.
         */
        that.geometry = __build_pallet();
        that.material = new THREE.MeshLambertMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);

        that.body = new CANNON.Body({
            mass: 5,
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Box(new CANNON.Vec3(that.width/2, that.height/2, that.beam_thickness*2))
        });
        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh, that.body);
    }
    //private method
    function __build_pallet() {
        /*
         * Build the pallet shaped geometry.
         *
         * @return: The pallet shaped geometry. (THREE.Geometry)
         */
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
    //private method
    function __build_support_beams() {
        /*
         * Build the support beams of the pallet shaped geometry.
         *
         * @return: An array of mesh's which represent the support beams of this Pallet. ([THREE.Mesh, ...])
         */
        var beams = [];
        for(var i = -1; i <= 1; i++) {
            var beam_mesh = __build_support_beam();
            beam_mesh.position.set(i*(that.beam_width/2 - that.width/2), 0, 0);
            beam_mesh.updateMatrix();
            beams.push(beam_mesh);
        }
        return beams;
    }
    //private method
    function __build_back_beams() {
        /*
         * Build the back beams of the pallet shaped geometry.
         *
         * Each back beam is made up of two halves in order to make destruction easier, because of this
         * the return value is in the form [beam_one_half_one, beam_one_half_two, beam_two_half_one, beam_two_half_two, ...]
         *
         * @return: An array of mesh's which represent the back beams of this Pallet. ([THREE.Mesh, ...])
         */
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
    //private method
    function __build_front_beams() {
        /*
         * Build the front beams of the pallet shaped geometry.
         *
         * Each front beam is made up of two halves in order to make destruction easier, because of this
         * the return value is in the form [beam_one_half_one, beam_one_half_two, beam_two_half_one, beam_two_half_two, ...]
         *
         * @return: An array of mesh's which represent the front beams of this Pallet. ([THREE.Mesh, ...])
         */
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
    //private method
    function __build_support_beam() {
        /*
         * Build the mesh for a single support beam.
         *
         * @return: The mesh which represents a single support beam. (THREE.Mesh)
         */
        return new THREE.Mesh(
            new THREE.BoxGeometry(that.beam_width, that.height, that.beam_thickness*2),
            that.material
        );
    }
    //private method
    function __build_cross_beam_half() {
        /*
         * Build the mesh for half of a cross beam.
         *
         * @return: A Mesh which represents half of a cross beam. (THREE.Mesh)
         */
        return new THREE.Mesh(
            new THREE.BoxGeometry(that.width/2, that.beam_width, that.beam_thickness/2),
            that.material
        );
    }
    //private method
    function __get_support_beam_debris() {
        /*
         * Get debris which represent the destroyed support beams of this Pallet.
         *
         * @return: An array of meshes which represent the debris the support beams. ([THREE.Mesh, THREE.Mesh, ...])
         */
        var debris = __build_support_beams();
        for(var i = 0; i < debris.length; i++) {
            /*
             * This loop essentially just positions all the beams to line up with this Pallets current position
             */
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
    //private method
    function __get_back_beam_debris() {
        /*
         * Get debris which represent the destroyed back beams of this Pallet.
         *
         * @return: An array of meshes which represent the debris the back beams. ([THREE.Mesh, THREE.Mesh, ...])
         */
        var debris = __build_back_beams();
        for(var i = 0; i < debris.length; i+=2) {
            /*
             * This loop essentially just positions all the beams to line up with this Pallets current position
             */
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
    //private method
    function __get_front_beam_debris() {
        /*
         * Get debris which represent the destroyed front beams of this Pallet.
         *
         * @return: An array of meshes which represent the debris the front beams. ([THREE.Mesh, THREE.Mesh, ...])
         */
        var debris = __build_front_beams();
        for(var i = 0; i < debris.length; i+=2) {
            /*
             * This loop essentially just positions all the beams to line up with this Pallets current position
             */
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
    //privileged method
    this.destroy = function () {
        /*
         * Get debris which represent the destroyed pieces of this Pallet.
         *
         * Each debris is given a body which can be used to simulate physics.
         *
         * @return: An array of Models which represent the destroyed pieces of this Pallet. ([MODELS_MODULE.Model, MODELS_MODULE.Model, ...])
         */
        var support_beam_debris = __get_support_beam_debris();
        var back_beam_debris = __get_back_beam_debris();
        var front_beam_debris = __get_front_beam_debris();

        var debris = [].concat(support_beam_debris, back_beam_debris, front_beam_debris);
        for(var j = 0; j < debris.length; j++) {
            debris[j].geometry.computeBoundingBox();
            var bounding_box = debris[j].geometry.boundingBox;

            debris[j] = new MODELS_MODULE.Model(
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
};
MODELS_MODULE.Pallet.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class.




