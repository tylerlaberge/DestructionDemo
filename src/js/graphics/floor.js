GRAPHIC_MODULE.Floor = (function () {
    function Floor(length, width, texture) {
        this.length = length;
        this.width = width;
        this.thickness = .5;
        this.texture = texture;

        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.body = null;

        var that = this;
        function __init() {
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
            GRAPHIC_MODULE.Graphic.call(that, that.geometry, that.material, that.mesh, that.body);
        }
        __init();
    }
    Floor.prototype = Object.create(GRAPHIC_MODULE.Graphic.prototype);
    return Floor;
})();