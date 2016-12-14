GRAPHIC_MODULE.Cannonball = (function () {
    function Cannonball(radius, texture){
        this.radius = radius;
        this.texture = texture;

        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.body = null;

        var that = this;
        function __init() {
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
    }
    Cannonball.prototype = Object.create(GRAPHIC_MODULE.Graphic.prototype);
    return Cannonball;
})();



