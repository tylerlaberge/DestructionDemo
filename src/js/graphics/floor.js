MODELS_MODULE.Floor = function(length, width, texture) {
    /*
     * A Class for representing and manipulating a model which represents a Floor.
     *
     * @param length: The length of this Floor. (Number)
     * @param width: The width of this Floor. (Number)
     * @param texture: The texture to apply to the material of this Floor.
     * @inherits: MODELS_MODULE.Model
     */

    //public members
    this.length = length;
    this.width = width;
    this.thickness = .5;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;

    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
         * Initialize the geometry, material, mesh, and body of this Floor.
         */
        that.texture.wrapS = THREE.RepeatWrapping;
        that.texture.wrapT = THREE.RepeatWrapping;
        that.texture.repeat.set(10, 10);

        that.geometry = new THREE.BoxGeometry(that.width, that.length, that.thickness);
        that.material = new THREE.MeshPhongMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);
        that.mesh.rotateX(degrees_to_radians(-90));

        that.body = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(that.width/2, that.length/2, that.thickness/2))
        });
        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh, that.body);
    }
    __init();
};
MODELS_MODULE.Floor.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class