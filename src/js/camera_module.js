window.CAMERA_MODULE  = (function () {
    /*
     * A module of camera's to be used by the App.
     */
    function PerspectiveCamera(width, height){
        /*
         * A Class which wraps the use of a THREE.PerspectiveCamera.
         *
         * @param width: The width to be used for this PerspectiveCamera's aspect ratio. (Number)
         * @param height: The height to be used for this PerspectiveCamera's aspect ratio. (Number)
         */

        //public members
        this.width = width;
        this.height = height;
        this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 0.1, 100);
    }
    PerspectiveCamera.prototype.set_position = function (x, y, z) {
        /*
         * Set the position of this camera.
         *
         * @param x: The x-axis position. (Number)
         * @param y: The y-axis position. (Number)
         * @param z: The z-axis position. (Number)
         */
        this.camera.position.set(x, y, z);
    };
    PerspectiveCamera.prototype.look_at = function(x, y, z) {
        /*
         * Set the position for this camera to look at.
         *
         * @param x: The x-axis position to look at. (Number)
         * @param y: The y-axis position to look at. (Number)
         * @param z: The z-axis position to look at. (Number)
         */
        this.camera.lookAt(new THREE.Vector3(x, y, z));
    };
    return {
        PerspectiveCamera: PerspectiveCamera
    }
})();