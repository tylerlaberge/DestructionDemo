MODELS_MODULE.Cannon = function (barrel_radius, barrel_length, barrel_rotation, texture) {
    /*
     * A Class for representing and manipulating a model which represents a Cannon.
     *
     * @param barrel_radius: The radius of this Cannon's barrel (Number)
     * @param barrel_length: The length of this Cannon's barrel (Number)
     * @param barrel_rotation: The x-axis rotation of this Cannon's barrel in radians (Number)
     * @param texture: The texture to apply to the material of this Cannon
     * @inherits: MODELS_MODULE.Model
     */

    //public members
    this.barrel_radius = barrel_radius;
    this.barrel_length = barrel_length;
    this.barrel_rotation = barrel_rotation;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;

    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
         * Initialize this Cannon's geometry, material, and mesh.
         */
        that.geometry = __build_cannon();
        that.material = new THREE.MeshPhongMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);

        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh);
    }
    //private method
    function __build_cannon() {
        /*
         * Build the cannon shaped geometry.
         *
         * @return: The cannon shaped geometry. (THREE.Geometry)
         */
        var cannon = new THREE.Geometry();

        var base = __build_base();
        var barrel = __build_barrel();

        base.updateMatrix();
        barrel.updateMatrix();

        cannon.merge(base.geometry, base.matrix);
        cannon.merge(barrel.geometry, barrel.matrix);

        return cannon;
    }
    //private method
    function __build_base() {
        /*
         * Build the base of the cannon shaped geometry.
         *
         * @return: The mesh which represents the base of this cannon. (THREE.Mesh)
         */
        var base_geometry = new THREE.Geometry();

        var right_leg_geometry = new THREE.BoxGeometry(that.barrel_radius/2, that.barrel_radius*2, that.barrel_length/2);
        var left_leg_geometry = new THREE.BoxGeometry(that.barrel_radius/2, that.barrel_radius*2, that.barrel_length/2);
        var connector_geomerty = new THREE.BoxGeometry(that.barrel_radius*3, that.barrel_radius/5, that.barrel_length/2);

        var left_leg_mesh = new THREE.Mesh(left_leg_geometry);
        var right_leg_mesh = new THREE.Mesh(right_leg_geometry);
        var connector_mesh = new THREE.Mesh(connector_geomerty);

        left_leg_mesh.position.set(-(1.5*that.barrel_radius), -that.barrel_radius, 0);
        right_leg_mesh.position.set((1.5*that.barrel_radius), -that.barrel_radius, 0);
        connector_mesh.position.set(0, -(1.25*that.barrel_radius), 0);

        left_leg_mesh.updateMatrix();
        right_leg_mesh.updateMatrix();
        connector_mesh.updateMatrix();

        base_geometry.merge(left_leg_mesh.geometry, left_leg_mesh.matrix);
        base_geometry.merge(right_leg_mesh.geometry, right_leg_mesh.matrix);
        base_geometry.merge(connector_mesh.geometry, connector_mesh.matrix);

        return new THREE.Mesh(base_geometry);
    }
    //private method
    function __build_barrel() {
        /*
         * Build the barrel of the cannon shaped geometry.
         *
         * @return: The mesh which represents the barrel of this cannon. (THREE.Mesh)
         */
        var barrel_geometry = new THREE.Geometry();

        var tube_geometry = new THREE.CylinderGeometry(
            that.barrel_radius, that.barrel_radius, that.barrel_length, 100, 100, true
        );
        var tube_base_geometry = new THREE.SphereGeometry(
            that.barrel_radius, 100, 100
        );
        var tube_end_geometry = new THREE.TorusGeometry(
            that.barrel_radius, .05, 100, 100
        );

        var tube_mesh = new THREE.Mesh(tube_geometry);
        var tube_base_mesh = new THREE.Mesh(tube_base_geometry);
        var tube_end_mesh = new THREE.Mesh(tube_end_geometry);

        tube_mesh.position.set(0, 0, 0);
        tube_mesh.rotateX(degrees_to_radians(90 - that.barrel_rotation));

        var y2 = Math.cos(degrees_to_radians(90 - that.barrel_rotation)) * that.barrel_length;
        var z2 = Math.sin(degrees_to_radians(90 - that.barrel_rotation)) * that.barrel_length;

        tube_mesh.position.set(0, y2/2, z2/2);
        tube_base_mesh.position.set(0, 0, 0);
        tube_end_mesh.position.set(0, 0, 0);
        tube_end_mesh.rotateX(degrees_to_radians(180 - that.barrel_rotation));
        tube_end_mesh.position.set(0, y2, z2);

        tube_mesh.updateMatrix();
        tube_base_mesh.updateMatrix();
        tube_end_mesh.updateMatrix();

        barrel_geometry.merge(tube_mesh.geometry, tube_mesh.matrix);
        barrel_geometry.merge(tube_base_mesh.geometry, tube_base_mesh.matrix);
        barrel_geometry.merge(tube_end_mesh.geometry, tube_end_mesh.matrix);

        return new THREE.Mesh(barrel_geometry);
    }
    __init();
};
MODELS_MODULE.Cannon.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class