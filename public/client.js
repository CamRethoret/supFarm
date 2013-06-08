var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);
		ige.globalSmoothing(true);

		// Load our textures
		var self = this;
		this.obj = [];

        self.gameTexture = {};

        self.gameTexture.iso_tiles = new IgeCellSheet('../assets/textures/tiles/iso_tiles.png',11,1);

        self.gameTexture.barn = new IgeTexture('../assets/textures/buildings/barn.png');
        self.gameTexture.cold_storage = new IgeTexture('../assets/textures/buildings/cold_storage.png');
        self.gameTexture.silo = new IgeTexture('../assets/textures/buildings/silo.png');

        self.gameTexture.tomatoes = new IgeTexture('../images/tomatoes.png');
        self.gameTexture.tomatoes_level1 = new IgeTexture('../assets/textures/tiles/tomatoes_level1.png');
        self.gameTexture.tomatoes_level2 = new IgeTexture('../assets/textures/tiles/tomatoes_level2.png');
        self.gameTexture.tomatoes_level3 = new IgeTexture('../assets/textures/tiles/tomatoes_level3.png');
        self.gameTexture.tomatoes_level4 = new IgeTexture('../assets/textures/tiles/tomatoes_level4.png');

        self.gameTexture.corn = new IgeTexture('../images/corn.png');
        self.gameTexture.corn_level1 = new IgeTexture('../assets/textures/tiles/corn_level1.png');
        self.gameTexture.corn_level2 = new IgeTexture('../assets/textures/tiles/corn_level2.png');
        self.gameTexture.corn_level3 = new IgeTexture('../assets/textures/tiles/corn_level3.png');
        self.gameTexture.corn_level4 = new IgeTexture('../assets/textures/tiles/corn_level4.png');

        self.gameTexture.wheat = new IgeTexture('../images/wheat.png');
        self.gameTexture.wheat_level1 = new IgeTexture('../assets/textures/tiles/wheat_level1.png');
        self.gameTexture.wheat_level2 = new IgeTexture('../assets/textures/tiles/wheat_level2.png');
        self.gameTexture.wheat_level3 = new IgeTexture('../assets/textures/tiles/wheat_level3.png');
        //self.gameTexture.wheat_level4 = new IgeTexture('../assets/textures/tiles/wheat_level4.png');

        self.userId = null;
        self.userLevel = null;

        self.cellEnemy = 5;
        self.cellPossesed = 4;
        self.cellNeutral = 3;

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

                    $('.build-silo').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Silo(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    $('.build-barn').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Barn(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    $('.build-cold').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Cold(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    $('.grow-tomatoes').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Tomatoes_Level1(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    $('.grow-corn').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Corn_Level1(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    $('.grow-wheat').on('click', function() {
                        self.isMovingElementUndefined();
                        self.movingElement = new ClientObjects.Wheat_Level1(self.objectLayer, self.objectLayer.mouseToTile().x, self.objectLayer.mouseToTile().y);
                        $('div.container.game').append('<div class="iso-popup building"><h4><a id="cancel">Cancel</a></h4></div>');
                        self.cancelBuildingElement();
                    });

                    self.enableMovingElement();

                    self.texIndex = self.textureMap1.addTexture(self.gameTexture.iso_tiles);

                    self.socket = io.connect();

                    // On récupère l'id user et on le sauvegarde en mémoire
                    self.socket.on('getUserId', function(user_id) {

                        self.userId = user_id;

                        self.socket.emit('getUserLevel', self.userId);
                        self.socket.on('returnUserLevel', function(user_level) {
                            self.userLevel = user_level;
                            $('.nav.pull-right .level').text('Level ' + self.userLevel);
                        })

                        self.refreshTileOnUpdate();


                        // On récupère toutes les tiles et on affiche si user, enemy ou neutral
                        self.socket.on('getTiles', function(tiles) {

                            for(var tile in tiles) {
                                var position = tiles[tile].position.split(",");

                                if(tiles[tile].status == user_id) {
                                    self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellPossesed);
                                } else if(tiles[tile].status == 0) {
                                    self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellNeutral);
                                } else {
                                    self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellEnemy);
                                }

                                if(tiles[tile].building != null) {
                                    switch(tiles[tile].building) {
                                        case 'Silo':
                                            new ClientObjects.Silo(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Barn':
                                            new ClientObjects.Barn(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Cold':
                                            new ClientObjects.Cold(self.objectLayer, position[0], position[1]);
                                            break;
                                    }
                                }
                                if(tiles[tile].growing != null) {
                                    switch(tiles[tile].growing) {
                                        case 'Tomatoes':
                                            new ClientObjects.Tomatoes(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level1':
                                            new ClientObjects.Tomatoes_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level2':
                                            new ClientObjects.Tomatoes_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level3':
                                            new ClientObjects.Tomatoes_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level4':
                                            new ClientObjects.Tomatoes_Level4(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn':
                                            new ClientObjects.Corn(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level1':
                                            new ClientObjects.Corn_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level2':
                                            new ClientObjects.Corn_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level3':
                                            new ClientObjects.Corn_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level4':
                                            new ClientObjects.Corn_Level4(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat':
                                            new ClientObjects.Wheat(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level1':
                                            new ClientObjects.Wheat_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level2':
                                            new ClientObjects.Wheat_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level3':
                                            new ClientObjects.Wheat_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                    }
                                }
                            }
                        });
                    });

                    ige.input.on('mouseUp', function (event, x, y, button) {

                        // On récupère les coordonnées du clic de l'utilisateur
                        var tileObjectLayer = self.objectLayer.mouseToTile();
                        var pos = tileObjectLayer.x + ',' + tileObjectLayer.y;

                        self.socket.emit('getTile', pos);
                        self.socket.on('returnTile', function(tile) {
                            if(tile.status == self.userId) {

                                $('div.container.game').append('<div class="iso-popup information"><h3>Informations</h3><div class="row"><div class="span1"><h5>Health</h5><span class="health badge badge-success">' + tile.health + '</span></div><div class="span1"><h5>Humidity</h5><span class="humidity badge badge-success">' + tile.humidity + '</span></div><div class="span1"><h5>Fertility</h5><span class="fertility badge badge-success">' + tile.fertility + '</span></div><a class="close-information">Close</a></div>');
                                $('.iso-popup.information .close-information').on('click', function() {
                                    $('.iso-popup.information').toggle("slide", function() {
                                        $('.iso-popup.information').remove();
                                    });
                                });

                                if(self.movingElement != undefined) {

                                    self.socket.emit('buildOnTile', { 'tile' : tile, 'build' : self.movingElement.classId(), 'type' : self.movingElement.type });

                                    self.socket.on('returnBuildOnTile', function(status) {
                                        if(status == 'success') {
                                            self.movingElement.removeFromMap(self.objectLayer);
                                            self.objectLayer.occupyTile(tileObjectLayer.x, tileObjectLayer.y, self.movingElement.widthInTile, self.movingElement.heightInTile, 1);

                                            switch(self.movingElement.classId()){
                                                case "Silo":
                                                    new ClientObjects.Silo(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Barn":
                                                    new ClientObjects.Barn(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Cold":
                                                    new ClientObjects.Cold(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes":
                                                    new ClientObjects.Tomatoes(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level1":
                                                    new ClientObjects.Tomatoes_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level2":
                                                    new ClientObjects.Tomatoes_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level3":
                                                    new ClientObjects.Tomatoes_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level4":
                                                    new ClientObjects.Tomatoes_Level4(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn":
                                                    new ClientObjects.Corn(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level1":
                                                    new ClientObjects.Corn_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level2":
                                                    new ClientObjects.Corn_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level3":
                                                    new ClientObjects.Corn_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level4":
                                                    new ClientObjects.Corn_Level4(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat":
                                                    new ClientObjects.Wheat(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level1":
                                                    new ClientObjects.Wheat_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level2":
                                                    new ClientObjects.Wheat_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level3":
                                                    new ClientObjects.Wheat_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                            }

                                            self.movingElement = undefined;
                                        }
                                    });
                                }
                            }

                            if(tile.status != self.userId) {
                                if($('div.iso-popup.information').length > 0) {
                                    $('.iso-popup.information').toggle("slide", function() {
                                        $('.iso-popup.information').remove();
                                    });
                                }
                                $('div.container.game').append('<div class="iso-popup capture"><h4><a id="capture-tile">Capture this tile !</a></h4><h4><a id="cancel">Cancel</a></h4></div>');
                                $('.iso-popup #cancel').on('click', function() {
                                    $('.iso-popup.capture').toggle("slide", function() {
                                        $('div.iso-popup.capture').remove();
                                    });
                                });
                                $('.iso-popup #capture-tile').on('click', function() {
                                    self.socket.emit('assignTileToPlayer', { 'player' : self.userId, 'tile_id' : tile._id });

                                    self.socket.on('tileCaptured', function() {
                                        self.socket.emit('calculateUserLevel', self.userId);

                                        self.socket.on('returnUserLevel', function(user_level) {
                                            $('.iso-popup.capture').html("<h4>You have captured the tile !<br/>You are now level " + user_level + ".</h4>");
                                            self.textureMap1.paintTile(tileObjectLayer.x, tileObjectLayer.y, self.texIndex, 4);

                                            $('.iso-popup.capture').delay(3000).toggle("slide", function() {
                                                $('.iso-popup.capture').remove();
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
	},
    enableMovingElement: function() {
        var self = this;
        this.objectLayer.mouseMove(function() {
            if(self.movingElement != undefined) {
                self.movingElement.removeFromMap(self.objectLayer);

                var point = self.objectLayer.mouseToTile();

                if(self.objectLayer.isTileOccupied(point.x, point.y, self.movingElement.widthInTile, self.movingElement.heightInTile, 1) == false) {
                    switch(self.movingElement.classId()) {
                        case "Silo":
                            self.movingElement = new ClientObjects.Silo(self.objectLayer, point.x, point.y);
                            break;
                        case "Barn":
                            self.movingElement = new ClientObjects.Barn(self.objectLayer, point.x, point.y);
                            break;
                        case "Cold":
                            self.movingElement = new ClientObjects.Cold(self.objectLayer, point.x, point.y);
                            break;
                        case "Tomatoes":
                            self.movingElement = new ClientObjects.Tomatoes(self.objectLayer, point.x, point.y);
                            break;
                        case "Tomatoes_Level1":
                            self.movingElement = new ClientObjects.Tomatoes_Level1(self.objectLayer, point.x, point.y);
                            break;
                        case "Tomatoes_Level2":
                            self.movingElement = new ClientObjects.Tomatoes_Level2(self.objectLayer, point.x, point.y);
                            break;
                        case "Tomatoes_Level3":
                            self.movingElement = new ClientObjects.Tomatoes_Level3(self.objectLayer, point.x, point.y);
                            break;
                        case "Tomatoes_Level4":
                            self.movingElement = new ClientObjects.Tomatoes_Level4(self.objectLayer, point.x, point.y);
                            break;
                        case "Corn":
                            self.movingElement = new ClientObjects.Corn(self.objectLayer, point.x, point.y);
                            break;
                        case "Corn_Level1":
                            self.movingElement = new ClientObjects.Corn_Level1(self.objectLayer, point.x, point.y);
                            break;
                        case "Corn_Level2":
                            self.movingElement = new ClientObjects.Corn_Level2(self.objectLayer, point.x, point.y);
                            break;
                        case "Corn_Level3":
                            self.movingElement = new ClientObjects.Corn_Level3(self.objectLayer, point.x, point.y);
                            break;
                        case "Corn_Level4":
                            self.movingElement = new ClientObjects.Corn_Level4(self.objectLayer, point.x, point.y);
                            break;
                        case "Wheat":
                            self.movingElement = new ClientObjects.Wheat(self.objectLayer, point.x, point.y);
                            break;
                        case "Wheat_Level1":
                            self.movingElement = new ClientObjects.Wheat_Level1(self.objectLayer, point.x, point.y);
                            break;
                        case "Wheat_Level2":
                            self.movingElement = new ClientObjects.Wheat_Level2(self.objectLayer, point.x, point.y);
                            break;
                        case "Wheat_Level3":
                            self.movingElement = new ClientObjects.Wheat_Level3(self.objectLayer, point.x, point.y);
                            break;
                    }
                }

            }
        });
    },
    cancelBuildingElement: function() {
        var self = this;
        $('.iso-popup #cancel').on('click', function() {
            if(self.movingElement != undefined) {
                self.movingElement.removeFromMap(self.objectLayer);
                self.movingElement = undefined;
            }
            $('.iso-popup').toggle("slide", function() {
                $('.iso-popup').remove();
            });
        });
    },
    removeIsoPopup: function() {
        $('.iso-popup').toggle("slide", function() {
            $('.iso-popup').remove();
        });
    },
    isMovingElementUndefined: function() {
        if(self.movingElement != undefined) {
            self.movingElement.removeFromMap(self.objectLayer);
            self.movingElement = undefined;
        }
    },
    refreshTileOnUpdate: function() {
        var self = this;
        self.socket.on('refreshTile', function(tile) {
            var position = tile.position.split(',');

            if(tile.status == self.userId) {
                self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellPossesed);
            } else if(tile.status == 0) {
                self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellNeutral);
            } else {
                self.textureMap1.paintTile(position[0], position[1], self.texIndex, self.cellEnemy);
            }


            if(tile.growing != null) {
                console.log(tile.growing);

                switch(tile.growing) {
                    case "Tomatoes":
                        new ClientObjects.Tomatoes(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level1":
                        new ClientObjects.Tomatoes_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level2":
                        new ClientObjects.Tomatoes_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level3":
                        new ClientObjects.Tomatoes_Level3(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level4":
                        new ClientObjects.Tomatoes_Level4(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn":
                        new ClientObjects.Corn(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level1":
                        new ClientObjects.Corn_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level2":
                        new ClientObjects.Corn_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level3":
                        new ClientObjects.Corn_Level3(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level4":
                        new ClientObjects.Corn_Level4(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat":
                        new ClientObjects.Wheat(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level1":
                        new ClientObjects.Wheat_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level2":
                        new ClientObjects.Wheat_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level3":
                        new ClientObjects.Wheat_Level3(self.objectLayer, position[0], position[1]);
                        break;
                }
            }
        });
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }