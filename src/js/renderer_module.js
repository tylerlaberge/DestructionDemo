window.RENDERER_MODULE = (function () {
    /*
     * A module of renderer's to be used by the App.
     */
    function WebGLRenderer(width, height, scene, camera) {
        /*
         * A Class which wraps the use of a THREE.WebGLRenderer.
         *
         * @param width: The width to render. (Number)
         * @param height: The height to render. (Number)
         * @param scene: The scene to render. (SCENE_MODULE.Scene)
         * @param camera_manager: The camera to render. (CAMERA_MODULE.Camera)
         */

        //public members
        this.renderer = new THREE.WebGLRenderer();
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.camera = camera;

        //private instance member
        var that = this;

        //private method
        function __init() {
            /*
             * Initialize this object.
             */
            that.renderer.setSize(that.width, that.height);
            document.body.appendChild(that.renderer.domElement);
        }
        __init();
    }
    WebGLRenderer.prototype.render = function () {
        /*
         * Render the scene.
         */
        var instance = this;
        requestAnimationFrame(function() {
            instance.render();
        });
        this.scene.update_physics();
        this.renderer.render(this.scene.get_scene(), this.camera.camera);
    };
    return {
        WebGLRenderer: WebGLRenderer
    }
})();

