GRAPHIC_MODULE.Cannonball = function(radius, texture){
    /*
     * A Class for creating and manipulating a model which represents a Cannonball.
     *
     * @param radius: The radius of this Cannonball. (Number)
     * @param texture: The texture to apply to the material of this Cannonball.
     * @inherits: Graphic
     */

    //public members
    this.radius = radius;
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
         * Initialize the geometry, material, mesh, and body of this Cannonball.
         */
        that.geometry = new THREE.SphereGeometry(that.radius, 100, 100);
        that.material = new THREE.MeshPhongMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);

        that.body = new CANNON.Body({
            mass: 15,
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Sphere(that.radius)
        });
        GRAPHIC_MODULE.Graphic.call(that, that.geometry, that.material, that.mesh, that.body);
    }
    __init();
};
GRAPHIC_MODULE.Cannonball.prototype = Object.create(GRAPHIC_MODULE.Graphic.prototype); //This class inherits the Graphic class



