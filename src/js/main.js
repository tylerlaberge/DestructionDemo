window.onload = function () {
    var WIDTH = document.body.clientWidth;
    var HEIGHT = document.body.clientHeight;

    var scene = new Scene();
    var camera = new Camera(WIDTH, HEIGHT);
    var renderer = new Renderer(WIDTH, HEIGHT, scene, camera);

    scene.build(function () {
        var floor_position = scene.floor.get_position();
        var pallet_position = scene.pallet.get_position();

        camera.set_position(floor_position.x - 14, floor_position.y + 3, floor_position.z + 15);
        camera.look_at(pallet_position.x, pallet_position.y, pallet_position.z);

        renderer.render();

        document.getElementById("loading_screen").style.display = "none";
        document.getElementById("source_button").style.display = "block";

        var reset_button = document.getElementById("reset_button");
        reset_button.style.display = 'block';
        reset_button.onclick = function () {
            scene.reset();
        };
    });
};