var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);
		ige.globalSmoothing(true);

		// Load our textures
		var self = this;
		this.obj = [];

        var gameTexture = [];

        gameTexture[0] = new IgeCellSheet('../assets/textures/tiles/iso_tiles.png',11,1);

        ige.on('texturesLoaded', function() {
            // Create the HTML canvas
            ige.createFrontBuffer(true);

            // Start the engine
            ige.start(function (success) {
                // Check if the engine started successfully
                if (success) {
                    // Create the scene
                    self.mainScene = new IgeScene2d()
                        .id('mainScene')
                        .drawBounds(true)
                        .drawBoundsData(true);

                    self.backScene = new IgeScene2d()
                        .id('backScene')
                        .depth(0)
                        .drawBounds(false)
                        .drawBoundsData(false)
                        .mount(self.mainScene);

                    self.objectLayer = new IgeTileMap2d()
                        .id('objectLayer')
                        .depth(1)
                        .isometricMounts(true)
                        .drawBounds(false)
                        .drawBoundsData(false)
                        .tileWidth(40)
                        .tileHeight(40)
                        .mount(self.mainScene);

                    // Create the main viewport
                    self.vp1 = new IgeViewport()
                        .id('vp1')
                        .autoSize(true)
                        .scene(self.mainScene)
                        .drawBounds(true)
                        .drawBoundsData(true)
                        .mount(ige);

                    // Create the 3d container that the player
                    // entity will be mounted to
                    self.player = new CharacterContainer()
                        .id('player')
                        .addComponent(PlayerComponent)
                        .isometric(true)
                        .drawBounds(false)
                        .drawBoundsData(false)
                        .mount(self.objectLayer);

                    self.textureMap1 = new IgeTextureMap()
                        .id('textureMap1')
                        .tileWidth(40)
                        .tileHeight(40)
                        .drawGrid(10)
                        .drawBounds(false)
                        .isometricMounts(true)
                        .mount(self.backScene);

                    // Set the camera to track the character with some
                    // tracking smoothing turned on (100)
                    self.vp1.camera.trackTranslate(self.player, 100);

                    var texIndex = self.textureMap1.addTexture(gameTexture[0]);

                    var socket = io.connect();

                    socket.on('getTiles', function(tiles) {

                        for(var tile in tiles) {
                            var position = tiles[tile].position.split(",");
                            var textureCell = 3;
                            self.textureMap1.paintTile(position[0], position[1], texIndex, textureCell);
                        }
                    });


                }
            });
        });
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }