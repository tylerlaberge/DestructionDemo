window.onload = function () {
    var WIDTH = document.body.clientWidth;
    var HEIGHT = document.body.clientHeight;

    var scene_manager = new SceneManager();

    //Create the scene. When finished create the camera and render managers.
    scene_manager.build_scene(function () {
        var floor_position = scene_manager.floor.get_position();
        var pallet_position = scene_manager.pallet.get_position();

        var camera_manager = new CameraManager(WIDTH, HEIGHT);

        camera_manager.set_position(floor_position.x - 14, floor_position.y + 3, floor_position.z + 15);
        camera_manager.look_at(pallet_position.x, pallet_position.y, pallet_position.z);

        var renderer_manager = new RendererManager(WIDTH, HEIGHT, scene_manager, camera_manager);

        //Render the scene.
        renderer_manager.render();
    });
};