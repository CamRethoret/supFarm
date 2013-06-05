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
        gameTexture[1] = new IgeTexture('../assets/textures/buildings/barn.png');
        gameTexture[2] = new IgeTexture('../assets/textures/buildings/cold_storage.png');

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
                        .highlightOccupied(true)
                        .mount(self.mainScene);

                    self.uiScene = new IgeScene2d()
                        .id('uiScene')
                        .depth(3)
                        .ignoreCamera(true)
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
                            if(tiles[tile].status == 1) {
                                self.textureMap1.paintTile(position[0], position[1], texIndex, 4);
                            } else {
                                self.textureMap1.paintTile(position[0], position[1], texIndex, textureCell);
                            }
                        }
                    });

                    ige.input.on('mouseUp', function (event, x, y, button) {

                        // Si le menu existe deja, on le supprime
                        if(self.uiCaptureTileButton != undefined || self.uiCaptureTileButton != null ) {
                            self.uiCaptureTileButton.destroy();
                        }
                        if(self.uiCancelTileButton != undefined || self.uiCancelTileButton != null ) {
                            self.uiCancelTileButton.destroy();
                        }
                        if(self.menuBar != undefined || self.menuBar != null) {
                            self.menuBar.destroy();
                        }

                        // On récupère les coordonnées du clic de l'utilisateur
                        var tilePoint = self.textureMap1.mouseTileWorldXY().to2d();
                        var position = tilePoint.x / 40 + ',' + tilePoint.y / 40;

                        // On créer le menu
                        self.menuBar = new IgeUiEntity()
                            .id('menuBar')
                            .depth(10)
                            .backgroundColor('#333333')
                            .left(0)
                            .top(50)
                            .width('20%')
                            .height(100)
                            .mouseDown(function () { if (ige.client.data('cursorMode') !== 'panning') { ige.input.stopPropagation(); } })
                            .mouseUp(function () { if (ige.client.data('cursorMode') !== 'panning') { ige.input.stopPropagation(); } })
                            .mouseMove(function () { if (ige.client.data('cursorMode') !== 'panning') { ige.input.stopPropagation(); } })
                            .mount(self.uiScene);

                        self.uiCaptureTileButton = new IgeUiButton()
                            .id('uiCaptureTileButton')
                            .depth(3)
                            .left(0)
                            .top(0)
                            .width('100%')
                            .height('50%')
                            .mouseDown(function () {
                                ige.input.stopPropagation();
                            })
                            .mouseUp(function () {
                                ige.client.data('cursorMode', 'select');
                                this.backgroundColor('#00baff');

                                socket.emit('getTile', position);
                                socket.on('returnTile', function(tile) {
                                    socket.emit('assignTileToPlayer', { 'player' : 1, 'tile_id' : tile._id });
                                });

                                ige.input.stopPropagation();
                            })
                            .mount(self.menuBar);

                        self.uiCaptureText = new IgeFontEntity()
                            .id('uiCaptureText')
                            .depth(4)
                            .text('Capture this tile !')
                            .width('100%')
                            .height('100%')
                            .mount(self.uiCaptureTileButton);

                        self.uiCancelTileButton = new IgeUiButton()
                            .id('uiCancelTileButton')
                            .left(0)
                            .top(50)
                            .width('100%')
                            .height('50%')
                            .mouseDown(function () {
                                ige.input.stopPropagation();
                            })
                            .mouseUp(function () {
                                ige.client.data('cursorMode', 'select');

                                if(self.uiCaptureTileButton != undefined || self.uiCaptureTileButton != null ) {
                                    self.uiCaptureTileButton.destroy();
                                }
                                if(self.uiCancelTileButton != undefined || self.uiCancelTileButton != null ) {
                                    self.uiCancelTileButton.destroy();
                                }
                                if(self.menuBar != undefined || self.menuBar != null) {
                                    self.menuBar.destroy();
                                }

                                ige.input.stopPropagation();
                            })
                            .mount(self.menuBar);

                        socket.on('tileCaptured', function() {
                            alert('You have captured the tile !');
                            self.textureMap1.paintTile(tilePoint.x / 40, tilePoint.y / 40, texIndex, 4);

                            if(self.uiCaptureTileButton != undefined || self.uiCaptureTileButton != null ) {
                                self.uiCaptureTileButton.destroy();
                            }
                            if(self.uiCancelTileButton != undefined || self.uiCancelTileButton != null ) {
                                self.uiCancelTileButton.destroy();
                            }
                            if(self.menuBar != undefined || self.menuBar != null) {
                                self.menuBar.destroy();
                            }
                        });
                    });
                }
            });
        });
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }