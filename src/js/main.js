window.onload = function () {
    window.APP = (function () {
        var WIDTH = document.body.clientWidth;
        var HEIGHT = document.body.clientHeight;

        var scene = new SCENE_MODULE.MainScene();
        var camera = new CAMERA_MODULE.PerspectiveCamera(WIDTH, HEIGHT);
        var renderer = new RENDERER_MODULE.WebGLRender(WIDTH, HEIGHT, scene, camera);

        function run() {
            scene.build(function () {
                var floor_position = scene.graphics['floor'].get_position();
                var pallet_position = scene.graphics['pallet'].get_position();

                camera.set_position(floor_position.x - 14, floor_position.y + 3, floor_position.z + 15);
                camera.look_at(pallet_position.x, pallet_position.y, pallet_position.z);

                renderer.render(scene, camera);

                document.getElementById("loading_screen").style.display = "none";
                document.getElementById("source_button").style.display = "block";

                var reset_button = document.getElementById("reset_button");
                reset_button.style.display = 'block';
                reset_button.onclick = function () {
                    scene.reset();
                };
            });
        }
        return {
            run: run
        };
    })();
    APP.run();
};