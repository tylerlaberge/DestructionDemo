window.onload = function () {
    var WIDTH = document.body.clientWidth;
    var HEIGHT = document.body.clientHeight;

    var scene_manager = new SceneManager();

    //Create the scene. When finished create the camera and render managers.
    scene_manager.build_scene(function () {
        var camera_manager = new CameraManager(WIDTH, HEIGHT,
            [-11, 5, 13]);
        var renderer_manager = new RendererManager(WIDTH, HEIGHT, scene_manager, camera_manager);

        //Render the scene.
        renderer_manager.render();
    });
};