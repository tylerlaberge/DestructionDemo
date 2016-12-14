window.MODELS_MODULE = (function () {
    /*
     * The Module which all Models should extend.
     *
     * By default this module contains only the base Model class.
     */
    function Model(geometry, material, mesh, body) {
        /*
         * A Base Class for representing and manipulating models.
         *
         * @param geometry: The geometry of this model. (THREE.Geometry)
         * @param material: The material of this model. (THREE.Material)
         * @param mesh: The mesh of this model. (THREE.Mesh)
         * @param body: The body of this model. (CANNON.Body)
         */
        this.geometry = geometry;
        this.material = material;
        this.mesh = mesh;
        this.body = body;
    }
    Model.prototype.get_position = function () {
        /*
         * Get the position of this model.
         *
         * @return: The position of this model. (THREE.Vector3)
         */
        return this.mesh.position;
    };
    Model.prototype.get_rotation = function () {
        /*
         * Get the rotation of this model.
         *
         * @return: The rotation of this model. (THREE.Euler)
         */
        return this.mesh.rotation;
    };
    Model.prototype.set_position = function (x, y, z) {
        /*
         * Set the position of this model.
         *
         * @param x: The x-axis position. (Number)
         * @param y: The y-axis position. (Number)
         * @param z: The z-axis position. (Number)
         */
        this.mesh.position.set(x, y, z);
        if (this.body != null) {
            this.body.position.copy(this.mesh.position);
            this.body.quaternion.copy(this.mesh.quaternion);
            this.update_physics();
        }
    };
    Model.prototype.set_rotation = function (x, y, z) {
        /*
         * Set the rotation of this model.
         *
         * @param x: The x-axis rotation in degrees. (Number)
         * @param y: The y-axis rotation in degrees. (Number)
         * @param z: The z-axis rotation in degrees. (Number)
         */
        this.mesh.rotation.set(degrees_to_radians(x), degrees_to_radians(y), degrees_to_radians(z));
        if (this.body != null) {
            this.body.position.copy(this.mesh.position);
            this.body.quaternion.copy(this.mesh.quaternion);
            this.update_physics();
        }
    };
    Model.prototype.set_velocity = function (i, j, k) {
        /*
         * Set the velocity of this model.
         *
         * @param i: The i component of the velocity. (Number)
         * @param j: The j component of the velocity. (Number)
         * @param k: The k component of the velocity. (Number)
         */
        this.body.velocity.set(i, j, k);
    };
    Model.prototype.rotateX = function (degrees) {
        /*
         * Rotate this model about the x-axis.
         *
         * @param degrees: The amount to rotate in degrees. (Number)
         */
        this.mesh.rotateX(degrees_to_radians(degrees));
    };
    Model.prototype.rotateY = function (degrees) {
        /*
         * Rotate this model about the y-axis.
         *
         * @param degrees: The amount to rotate in degrees. (Number)
         */
        this.mesh.rotateY(degrees_to_radians(degrees));
    };
    Model.prototype.rotateZ = function (degrees) {
        /*
         * Rotate this model about the z-axis.
         *
         * @param degrees: The amount to rotate in degrees. (Number)
         */
        this.mesh.rotateZ(degrees_to_radians(degrees));
    };
    Model.prototype.translateX = function (distance) {
        /*
         * Translate this model about the x-axis.
         *
         * @param degrees: The amount to translate. (Number)
         */
        this.mesh.translateX(distance);
    };
    Model.prototype.translateY = function (distance) {
        /*
         * Translate this model about the y-axis.
         *
         * @param degrees: The amount to translate. (Number)
         */
        this.mesh.translateY(distance);
    };
    Model.prototype.translateZ = function (distance) {
        /*
         * Translate this model about the z-axis.
         *
         * @param degrees: The amount to translate. (Number)
         */
        this.mesh.translateZ(distance);
    };
    Model.prototype.add_to_scene = function (scene) {
        /*
         * Add this model to a scene.
         *
         * @param scene: The scene to add this model to. (THREE.Scene)
         */
        scene.add(this.mesh);
    };
    Model.prototype.add_to_world = function (world) {
        /*
         * Add this model to a world.
         *
         * @param world: The world to add this model to. (CANNON.World)
         */
        if (this.body != null) {
            world.addBody(this.body);
        }
    };
    Model.prototype.remove_from_scene = function (scene) {
        /*
         * Remove this model from a scene.
         *
         * @param scene: The scene to remove this model from. (THREE.Scene)
         */
        scene.remove(this.mesh);
    };
    Model.prototype.remove_from_world = function (world) {
        /*
         * Remove this model from a world.
         *
         * @param world: The world to remove this model from. (CANNON.World)
         */
        if (this.body != null) {
            world.removeBody(this.body);
        }
    };
    Model.prototype.update_physics = function () {
        /*
         * Update this models position and rotation according to its physics body.
         */
        if (this.body != null) {
            this.mesh.position.copy(this.body.position);
            this.mesh.quaternion.copy(this.body.quaternion);
        }
    };
    Model.prototype.update_body = function () {
        /*
         * Update this models physics body according to its position and rotation.
         */
        if (this.body != null) {
            this.body.position.copy(this.mesh.position);
            this.body.quaternion.copy(this.mesh.quaternion);
        }
    };
    return {
        Model: Model
    }
})();


