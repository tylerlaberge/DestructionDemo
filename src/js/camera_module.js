window.CAMERA_MODULE  = (function () {
    function PerspectiveCamera(width, height){
        this.width = width;
        this.height = height;
        this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 0.1, 100);
    }
    PerspectiveCamera.prototype.set_position = function (x, y, z) {
        this.camera.position.set(x, y, z);
    };
    PerspectiveCamera.prototype.look_at = function(x, y, z) {
        this.camera.lookAt(new THREE.Vector3(x, y, z));
    };
    return {
        PerspectiveCamera: PerspectiveCamera
    }
})();