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
        self.userMoney = null;
        self.userHealth = null

        self.cellEnemy = 5;
        self.cellPossesed = 4;
        self.cellNeutral = 3;

        self.objectBuildGrow = {};

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

                    $('.buy-baseball').on('click', function() {
                        if($('.iso-popup .buy').length > 0) {
                            $('.iso-popup .buy').remove();
                        }
                        self.isMovingElementUndefined();
                        $('div.container.game').append('<div class="iso-popup buy"><h3>Weapon</h3><div><img style="width: 175px;" src="../assets/textures/weapons/baseball.png"></div><h4>Buy a Baseball Bat for $ 30 000 ?</h4><div style="width: 150px; margin: auto;"><h5 style="float: left;"><a id="buy" class="baseball">Buy it !</a></h5><h5 style="float: right;"><a id="cancel">Cancel</a></h5></div></div>');

                        $('.iso-popup.buy a.baseball').on('click', function() {
                            self.socket.emit('buyWeapon', { 'user_id' : self.userId, 'weapon' : 'Baseball Bat' });
                            self.socket.on('returnBuyWeapon', function(data) {
                                if(data.type == 'success') {
                                    $('.iso-popup.buy a.baseball').popover('disable');
                                    $('.iso-popup.buy').html('<h3>Congratulations !</h3><div>You have now a beautiful Baseball Bat !</div>');

                                    self.socket.emit('getUserMoney', self.userId);

                                    setTimeout(function() {
                                        self.removeIsoPopup();
                                    }, 3000);
                                } else {
                                    $('.iso-popup.buy a.baseball').popover({
                                        animation: true,
                                        title : 'How about no ?',
                                        content : data.message,
                                        placement : 'top',
                                        trigger : 'manual'
                                    });
                                    $('.iso-popup.buy a.baseball').popover('show');
                                    setTimeout(function() {
                                        $('.iso-popup.buy a.baseball').popover('hide');
                                    }, 3000);
                                }
                            });
                        });

                        self.cancelBuildingElement();
                    });

                    $('.buy-chainsaw').on('click', function() {
                        if($('.iso-popup .buy').length > 0) {
                            $('.iso-popup .buy').remove();
                        }
                        self.isMovingElementUndefined();
                        $('div.container.game').append('<div class="iso-popup buy"><h3>Weapon</h3><div><img style="width: 85px;" src="../assets/textures/weapons/chainsaw.png"></div><h4>Buy a Chainsaw for $ 50 000 ?</h4><div style="width: 150px; margin: auto;"><h5 style="float: left;"><a id="buy" class="chainsaw">Buy it !</a></h5><h5 style="float: right;"><a id="cancel">Cancel</a></h5></div></div>');

                        $('.iso-popup.buy a.chainsaw').on('click', function() {
                            self.socket.emit('buyWeapon', { 'user_id' : self.userId, 'weapon' : 'Chainsaw' });
                            self.socket.on('returnBuyWeapon', function(data) {
                                if(data.type == 'success') {
                                    $('.iso-popup.buy a.chainsaw').popover('disable');
                                    $('.iso-popup.buy').html('<h3>Congratulations !</h3><div>You have now a beautiful Chainsaw !</div>');

                                    self.socket.emit('getUserMoney', self.userId);

                                    setTimeout(function() {
                                        self.removeIsoPopup();
                                    }, 3000);
                                } else {
                                    $('.iso-popup.buy a.chainsaw').popover({
                                        animation: true,
                                        title : 'How about no ?',
                                        content : data.message,
                                        placement : 'top',
                                        trigger : 'manual'
                                    });
                                    $('.iso-popup.buy a.chainsaw').popover('show');
                                    setTimeout(function() {
                                        $('.iso-popup.buy a.chainsaw').popover('hide');
                                    }, 3000);
                                }
                            });
                        });

                        self.cancelBuildingElement();
                    });

                    $('.buy-ak').on('click', function() {
                        if($('.iso-popup .buy').length > 0) {
                            $('.iso-popup .buy').remove();
                        }
                        self.isMovingElementUndefined();
                        $('div.container.game').append('<div class="iso-popup buy"><h3>Weapon</h3><div><img style="width: 175px;" src="../assets/textures/weapons/ak47.png"></div><h4>Buy an AK-47 for $ 75 000 ?</h4><div style="width: 150px; margin: auto;"><h5 style="float: left;"><a id="buy" class="ak">Buy it !</a></h5><h5 style="float: right;"><a id="cancel">Cancel</a></h5></div></div>');

                        $('.iso-popup.buy a.ak').on('click', function() {
                            self.socket.emit('buyWeapon', { 'user_id' : self.userId, 'weapon' : 'AK-47' });
                            self.socket.on('returnBuyWeapon', function(data) {
                                if(data.type == 'success') {
                                    $('.iso-popup.buy a.ak').popover('disable');
                                    $('.iso-popup.buy').html('<h3>Congratulations !</h3><div>You have now a beautiful AK-47 !</div>');

                                    self.socket.emit('getUserMoney', self.userId);

                                    setTimeout(function() {
                                        self.removeIsoPopup();
                                    }, 3000);
                                } else {
                                    $('.iso-popup.buy a.ak').popover({
                                        animation: true,
                                        title : 'How about no ?',
                                        content : data.message,
                                        placement : 'top',
                                        trigger : 'manual'
                                    });
                                    $('.iso-popup.buy a.ak').popover('show');
                                    setTimeout(function() {
                                        $('.iso-popup.buy a.ak').popover('hide');
                                    }, 3000);
                                }
                            });
                        });

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

                            self.socket.emit('getUserHealth', self.userId);
                        })

                        self.socket.emit('getUserMoney', self.userId);
                        self.socket.on('returnUserMoney', function(user_money) {
                            self.userMoney = user_money;
                            $('.nav.pull-right .money').text('Money : $ ' + self.userMoney);
                        });

                        var intervalResting = null;

                        self.socket.emit('getUserHealth', self.userId);
                        self.socket.on('returnUserHealth', function(data) {
                            self.userHealth = data.current;
                            self.userHealthMax = data.max;

                            if($('.nav.pull-right .health').length > 0) {
                                if($('.nav.pull-right .health .user-rest').css('display') == 'none') {
                                    $('.nav.pull-right .health').html('<div class="row"><div class="span2 life">Health : ' + self.userHealth + ' / ' + self.userHealthMax + '</div><div class="span2 progress progress-success progress-striped active"><div class="bar" style="width: ' + ((self.userHealth * 100) / self.userHealthMax) + '%;"></div></div><div class="span1"><a class="user-rest" style="display: none;">Rest</a><a class="stop-rest" style="display: inline;">Resting</a></div></div>');
                                } else {
                                    $('.nav.pull-right .health').html('<div class="row"><div class="span2 life">Health : ' + self.userHealth + ' / ' + self.userHealthMax + '</div><div class="span2 progress progress-success progress-striped active"><div class="bar" style="width: ' + ((self.userHealth * 100) / self.userHealthMax) + '%;"></div></div><div class="span1"><a class="user-rest">Rest</a><a class="stop-rest" style="display: none;">Resting</a></div></div>');
                                }
                            } else {
                                $('.nav.pull-right .health').html('<div class="row"><div class="span2 life">Health : ' + self.userHealth + ' / ' + self.userHealthMax + '</div><div class="span2 progress progress-success progress-striped active"><div class="bar" style="width: ' + ((self.userHealth * 100) / self.userHealthMax) + '%;"></div></div><div class="span1"><a class="user-rest">Rest</a><a class="stop-rest" style="display: none;">Resting</a></div></div>');
                            }

                            $('.nav.pull-right .health .user-rest').on('click', function() {

                                $(this).css('display', 'none');
                                $('.nav.pull-right .health .stop-rest').css('display', 'inline');

                                intervalResting = setInterval(function() {
                                    self.socket.emit('userIsResting', self.userId);
                                    console.log('User resting.')
                                }, 1000);

                                self.socket.on('returnUserIsResting', function(data) {
                                    $('.nav.pull-right .health .life').text('Health : ' + data.health + ' / ' + data.health_max);
                                    $('.nav.pull-right .health .progress').html('<div class="bar" style="width: ' + ((data.health * 100) / data.health_max) + '%;">');
                                    self.userHealth = data.health;
                                    self.userHealthMax = data.health_max;
                                });
                            });
                            $('.nav.pull-right .health .stop-rest').on('click', function() {

                                $(this).css('display', 'none');
                                $('.nav.pull-right .health .user-rest').css('display', 'inline');

                                clearInterval(intervalResting);
                                intervalResting = null;
                                self.socket.emit('userNotResting', self.userId);
                                console.log('User not resting');
                            });
                        });

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
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Silo(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Barn':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Barn(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Cold':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Cold(self.objectLayer, position[0], position[1]);
                                            break;
                                    }
                                }
                                if(tiles[tile].growing != null) {
                                    switch(tiles[tile].growing) {
                                        case 'Tomatoes':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Tomatoes(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level1':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Tomatoes_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level2':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Tomatoes_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level3':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Tomatoes_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Tomatoes_Level4':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Tomatoes_Level4(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Corn(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level1':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Corn_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level2':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Corn_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level3':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Corn_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Corn_Level4':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Corn_Level4(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Wheat(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level1':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Wheat_Level1(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level2':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Wheat_Level2(self.objectLayer, position[0], position[1]);
                                            break;
                                        case 'Wheat_Level3':
                                            self.objectBuildGrow[tiles[tile].position] =  new ClientObjects.Wheat_Level3(self.objectLayer, position[0], position[1]);
                                            break;
                                    }
                                }
                            }
                        });
                    });

                    var blinkInterval = null;

                    ige.input.on('mouseUp', function (event, x, y, button) {

                        // On récupère les coordonnées du clic de l'utilisateur
                        var tileObjectLayer = self.objectLayer.mouseToTile();
                        var pos = tileObjectLayer.x + ',' + tileObjectLayer.y;

                        $('.iso-popup').remove();
                        $('.modal').remove();

                        self.socket.emit('getTile', pos);
                        self.socket.on('returnTile', function(tile) {
                            if(tile.status == self.userId) {
                                if(blinkInterval != null) {
                                    clearInterval(blinkInterval);
                                    blinkInterval = null;
                                }

                                var healthBadge = '',
                                    humidity = '',
                                    fertility = '';

                                if(tile.health > 50) {
                                    healthBadge = 'badge-success';
                                } else if(tile.health <= 50 && tile.health > 20) {
                                    healthBadge = 'badge-warning';
                                } else if(tile.health <= 20) {
                                    healthBadge = 'badge-important';
                                }

                                if(tile.humidity > 50) {
                                    humidity = 'badge-success';
                                } else if(tile.humidity <= 50 && tile.humidity > 20) {
                                    humidity = 'badge-warning';
                                } else if(tile.humidity <= 20) {
                                    humidity = 'badge-important';
                                }

                                if(tile.fertility > 50) {
                                    fertility = 'badge-success';
                                } else if(tile.fertility <= 50 && tile.fertility > 20) {
                                    fertility = 'badge-warning';
                                } else if(tile.fertility <= 20) {
                                    fertility = 'badge-important';
                                }

                                if(tile.growing != null) {
                                    $('.iso-popup').remove();
                                    $('.modal').remove();

                                    $('div.container.game').append('<div id="' + tile.position + '" class="iso-popup information-grow"><h3>Informations</h3><div class="row"><div class="span1"><h5>Health</h5><span class="health badge ' + healthBadge + '">' + tile.health + ' %</span></div><div class="span1"><h5>Humidity</h5><span class="humidity badge ' + humidity + '">' + tile.humidity + ' %</span></div><div class="span1"><h5>Fertility</h5><span class="fertility badge ' + fertility + '">' + tile.fertility + ' %</span></div><a class="close-information">Close</a></div><div class="grow"></div><div class="action-grow"></div>');

                                    var growing = '',
                                        src = '';

                                    if(tile.growing.indexOf('Tomatoes') !== -1) {
                                        growing = 'Tomatoes';
                                        src = '../images/tomatoes.png';
                                    } else if(tile.growing.indexOf('Corn') !== -1) {
                                        growing = 'Corn';
                                        src = '../images/corn.png';
                                    } else if(tile.growing.indexOf('Wheat') !== -1) {
                                        growing = 'Wheat';
                                        src = '../images/wheat.png';
                                    }

                                    $('.iso-popup.information-grow .grow').append('<h4>' + growing + '</h4><div class="row"><div class="span1"><img src="' + src + '"/></div><div class="span1"><h5>Time</h5><span class="time badge badge-info">' + tile.time + ' s</span></div><div class="span1"><h5>Maturity</h5><span class="maturity badge badge-info">' + tile.maturity + ' %</span></div></div></div>');

                                    $('.iso-popup.information-grow .action-grow').append('<h4>Actions</h4><div class="row"><div class="span1"><h5><a class="water-tile">Water</a></h5></div><div class="span1"><h5><a class="fertilize-tile">Fertilize</a></h5></div><div class="span1"><h5><a class="harvest-tile">Harvest</a></h5></div></div>');

                                    $('.iso-popup.information-grow .water-tile').on('click', function() {
                                        self.socket.emit('waterDatTile', tile);
                                        self.socket.on('returnWaterTile', function(data) {
                                            if(data.type == 'success') {
                                                $('.iso-popup.information-grow .harvest-tile').popover('disable');
                                                $('.iso-popup.information-grow .humidity').text(data.humidity + ' %');
                                                if(data.humidity > 50) {
                                                    $('.iso-popup.information-grow .humidity').removeClass().addClass('humidity badge badge-success');
                                                } else if(data.humidity <= 50 && data.humidity > 20) {
                                                    $('.iso-popup.information-grow .humidity').removeClass().addClass('humidity badge badge-warning');
                                                } else if(data.humidity <= 20) {
                                                    $('.iso-popup.information-grow .humidity').removeClass().addClass('humidity badge badge-important');
                                                }

                                                $('.iso-popup.information-grow .health').text(data.health + ' %');
                                                if(data.health > 50) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-success');
                                                } else if(data.health <= 50 && data.health > 20) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-warning');
                                                } else if(data.health <= 20) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-important');
                                                }
                                            } else if(data.type == 'error') {
                                                $('.iso-popup.information-grow .water-tile').popover({
                                                    animation: true,
                                                    title : 'How about no ?',
                                                    content : data.message,
                                                    placement : 'top',
                                                    trigger : 'manual'
                                                });
                                                $('.iso-popup.information-grow .water-tile').popover('show');
                                                setTimeout(function() {
                                                    $('.iso-popup.information-grow .water-tile').popover('hide');
                                                }, 3000);
                                            }
                                        });
                                    });

                                    $('.iso-popup.information-grow .fertilize-tile').on('click', function() {
                                        self.socket.emit('fertilizeDatTile', tile);
                                        self.socket.on('returnFertilizeTile', function(data) {
                                            if(data.type == 'success') {
                                                $('.iso-popup.information-grow .fertilize-tile').popover('disable');
                                                $('.iso-popup.information-grow .fertility').text(data.fertility + ' %');
                                                if(data.fertility > 50) {
                                                    $('.iso-popup.information-grow .fertility').removeClass().addClass('fertility badge badge-success');
                                                } else if(data.fertility <= 50 && data.fertility > 20) {
                                                    $('.iso-popup.information-grow .fertility').removeClass().addClass('fertility badge badge-warning');
                                                } else if(data.fertility <= 20) {
                                                    $('.iso-popup.information-grow .fertility').removeClass().addClass('fertility badge badge-important');
                                                }

                                                $('.iso-popup.information-grow .health').text(data.health + ' %');
                                                if(data.health > 50) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-success');
                                                } else if(data.health <= 50 && data.health > 20) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-warning');
                                                } else if(data.health <= 20) {
                                                    $('.iso-popup.information-grow .health').removeClass().addClass('health badge badge-important');
                                                }
                                            } else if(data.type == 'error') {
                                                $('.iso-popup.information-grow .fertilize-tile').popover({
                                                    animation: true,
                                                    title : 'How about no ?',
                                                    content : data.message,
                                                    placement : 'top',
                                                    trigger : 'manual'
                                                });
                                                $('.iso-popup.information-grow .fertilize-tile').popover('show');
                                                setTimeout(function() {
                                                    $('.iso-popup.information-grow .fertilize-tile').popover('hide');
                                                }, 3000);
                                            }
                                        });
                                    });

                                    $('.iso-popup.information-grow .harvest-tile').on('click', function() {
                                        self.socket.emit('harvestDatTile', tile);
                                        self.socket.on('returnHarvestTile', function(data) {
                                            if(data.type == 'success') {
                                                $('.iso-popup.information-grow .grow').html('<h4>Congratulation !</h4><div><h5>You produced ' + data.productivity + ' ' + tile.growing + ' !</h5></div>');
                                                $('.iso-popup.information-grow .action-grow').html('<h4>Action</h4><div><h5><a class="sell-grow">Sell this for $ ' + data.money + ' !</a></h5></div>');

                                                self.objectBuildGrow[tile.position].removeFromMap(self.objectLayer);

                                                $('.iso-popup.information-grow .action-grow').on('click', function() {
                                                    self.socket.emit('sellGrow', { 'user_id' : tile.status, 'money' : data.money } );
                                                    self.socket.on('returnSellGrow', function(sell) {
                                                        $('.iso-popup.information-grow .action-grow').html('<h4>Money time !</h4><div><h5>You now have $ ' + sell + ' !</h5></div>');
                                                    });
                                                });

                                            } else if(data.type == 'error') {
                                                $('.iso-popup.information-grow .harvest-tile').popover({
                                                    animation: true,
                                                    title : 'How about no ?',
                                                    content : data.message,
                                                    placement : 'top',
                                                    trigger : 'manual'
                                                });
                                                $('.iso-popup.information-grow .harvest-tile').popover('show');
                                                setTimeout(function() {
                                                    $('.iso-popup.information-grow .harvest-tile').popover('hide');
                                                }, 3000);
                                            }
                                        });
                                    });

                                    $('.iso-popup.information-grow .close-information').on('click', function() {
                                        $('.iso-popup.information-grow').toggle("slide", function() {
                                            $('.iso-popup.information-grow').remove();
                                        });
                                    });
                                } else {
                                    $('.iso-popup').remove();

                                    $('div.container.game').append('<div id="' + tile.position + '" class="iso-popup information"><h3>Informations</h3><div class="row"><div class="span1"><h5>Health</h5><span class="health badge ' + healthBadge + '">' + tile.health + ' %</span></div><div class="span1"><h5>Humidity</h5><span class="humidity badge ' + humidity + '">' + tile.humidity + ' %</span></div><div class="span1"><h5>Fertility</h5><span class="fertility badge ' + fertility + '">' + tile.fertility + ' %</span></div><a class="close-information">Close</a></div>');
                                    $('.iso-popup.information .close-information').on('click', function() {
                                        $('.iso-popup.information').toggle("slide", function() {
                                            $('.iso-popup.information').remove();
                                        });
                                    });
                                }

                                if(self.movingElement != undefined) {

                                    self.socket.emit('buildOnTile', { 'tile' : tile, 'build' : self.movingElement.classId(), 'type' : self.movingElement.type });

                                    self.socket.on('returnBuildOnTile', function(status) {
                                        if(status == 'success') {
                                            self.movingElement.removeFromMap(self.objectLayer);
                                            self.objectLayer.occupyTile(tileObjectLayer.x, tileObjectLayer.y, self.movingElement.widthInTile, self.movingElement.heightInTile, 1);

                                            console.log('position : ' + pos);
                                            console.log('tileObjectLayer : ' + tileObjectLayer);

                                            switch(self.movingElement.classId()){
                                                case "Silo":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Silo(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Barn":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Barn(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Cold":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Cold(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Tomatoes(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level1":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Tomatoes_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level2":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Tomatoes_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level3":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Tomatoes_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Tomatoes_Level4":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Tomatoes_Level4(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Corn(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level1":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Corn_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level2":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Corn_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level3":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Corn_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Corn_Level4":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Corn_Level4(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Wheat(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level1":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Wheat_Level1(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level2":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Wheat_Level2(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                                case "Wheat_Level3":
                                                    self.objectBuildGrow[pos] = new ClientObjects.Wheat_Level3(self.objectLayer, tileObjectLayer.x, tileObjectLayer.y);
                                                    self.removeIsoPopup();
                                                    break;
                                            }

                                            self.movingElement = undefined;
                                        }
                                    });
                                }
                            } else if(tile.status != self.userId) {
                                if($('.iso-popup.information').length > 0) {
                                    $('.iso-popup.information').toggle("slide", function() {
                                        $('.iso-popup.information').remove();
                                    });
                                }
                                if($('.iso-popup.information-grow').length > 0) {
                                    $('.iso-popup.information-grow').toggle("slide", function() {
                                        $('.iso-popup.information-grow').remove();
                                    });
                                }

                                if(tile.status == 0) {
                                    $('.iso-popup').remove();
                                    $('.modal').remove();

                                    if(blinkInterval != null) {
                                        clearInterval(blinkInterval);
                                        blinkInterval = null;
                                    }
                                    $('div.container.game').append('<div class="iso-popup capture"><h4><a id="capture-tile">Capture this tile !</a></h4><h4><a id="cancel">Cancel</a></h4></div>');

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
                                } else {
                                    if(blinkInterval != null) {
                                        clearInterval(blinkInterval);
                                        blinkInterval = null;
                                    }


                                    self.socket.emit('getUserStatus', self.userId);
                                    self.socket.on('returnUserStatus', function(data) {
                                        if(data == 'Resting') {
                                            $('.iso-popup.capture').html('<h4>You can\'t attack someone in mode Rest.</h4>');
                                            setTimeout(function() {
                                                $('.iso-popup').remove();
                                            }, 3000);
                                            $('.modal').remove();
                                        } else {
                                            self.socket.emit('getGraceTime', { 'attacker' : self.userId, 'defender' : tile.status });
                                        }


                                    });

                                    self.socket.on('returnGraceTime', function(data) {
                                        if(data.status == 'error') {
                                            $('.container.game').append('<div class="iso-popup information"><h4>Grace Time !</h4><h5>You can\'t attack this player for ' + data.time + ' seconds.</h5></div>');
                                            setTimeout(function() {
                                                $('.iso-popup').remove();
                                            }, 3000);
                                            $('.modal').remove();
                                        } else if(data.status == 'success') {
                                            $('div.container.game').append('<div class="iso-popup capture"><h4><a id="attack-tile" href="#modalWeapon" data-toggle="modal">Attack this tile !</a></h4><h4><a id="cancel">Cancel</a></h4></div>');

                                            $('.iso-popup.capture #attack-tile').on('click', function() {

                                                if(self.userHealth == 0) {
                                                    $('.iso-popup.capture').html('<h4>You have no health. You must rest before attacking someone.</h4>');
                                                    setTimeout(function() {
                                                        $('.iso-popup').remove();
                                                    }, 3000);
                                                    return false;
                                                } else {
                                                    var blink = 0;
                                                    blinkInterval = setInterval(function() {
                                                        if(blink == 0) {
                                                            self.textureMap1.paintTile(tileObjectLayer.x, tileObjectLayer.y, self.texIndex, 4);
                                                            blink = 1;
                                                        } else if(blink == 1) {
                                                            self.textureMap1.paintTile(tileObjectLayer.x, tileObjectLayer.y, self.texIndex, 5);
                                                            blink = 0;
                                                        }
                                                    }, 500);
                                                }
                                            });

                                            self.socket.emit('getWeaponForUser', self.userId);
                                            self.socket.on('returnGetWeaponForUser', function(data) {

                                                $('.modal').remove();

                                                $('div.container.game')
                                                    .append('<div id="modalWeapon" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalWeaponLabel" aria-hidden="true">' +
                                                        '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="modalWeaponLabel">Choose your weapon</h3></div>' +
                                                        '<div class="modal-body"><div class="message"></div></div>' +
                                                        '<div class="modal-footer"><button id="cancel-attack" class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button><button class="btn btn-primary confirm-attack">Attack !</button></div></div>');

                                                $.each(data, function(index, weapon) {
                                                    $('div#modalWeapon .modal-body').append('<h4 class="' + weapon.type + '">' + weapon.type + '</h4>');
                                                    $('.modal-body h4.'+weapon.type).css('border', '1px solid black').css('padding', '5px').css('border-radius', '4px');

                                                    $('.modal-body h4.'+weapon.type).on('click', function() {
                                                        if($('.modal-body h4.selected').length > 0) {
                                                            $('.modal-body h4.selected').removeClass('selected').css('background-color', '').css('color', '');
                                                        }
                                                        $(this).addClass('selected');
                                                        $(this).css('color', 'white').css('background-color', 'rgb(0, 129, 194)');
                                                    });
                                                });

                                                $('.modal-footer #cancel-attack').on('click', function() {
                                                    $('#modalWeapon').modal('hide').remove();
                                                    $('.iso-popup').remove();

                                                    clearInterval(blinkInterval);
                                                    blinkInterval = null;
                                                });

                                                $('.modal-footer .confirm-attack').on('click', function() {
                                                    if($('.modal-body h4.selected').length > 0) {
                                                        var weapon = $('.modal-body h4.selected').attr('class').split(' ');
                                                        weapon = weapon[0];

                                                        $('.iso-popup').remove();

                                                        $('#modalWeapon').modal('hide').remove();
                                                        $('div.container.game')
                                                            .append('<div id="modalFight" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalFightLabel" aria-hidden="true">' +
                                                                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="modalFightLabel">Fight for your life !</h3></div>' +
                                                                '<div class="modal-body"></div>' +
                                                                '<div class="modal-footer"></div></div>');

                                                        $('div.modal-body').append('<div class="row">' +
                                                            '<div class="span2 attacker"></div>' +
                                                            '<div class="span2 defender"></div></div>');

                                                        $('div.modal-body .attacker').append('<h4>Attacker</h4><div class="progress progress-striped active">' +
                                                            '<div class="bar" style="width: 100%;"></div>' +
                                                            '</div>');
                                                        $('div.modal-body .attacker').append('<div class="result"></div>');
                                                        $('div.modal-body .attacker').append('<div class="damage"></div>');
                                                        $('div.modal-body .attacker').append('<div class="weapon"></div>');
                                                        $('div.modal-body .defender').append('<h4>Defender</h4><div class="progress progress-striped active">' +
                                                            '<div class="bar" style="width: 100%;"></div>' +
                                                            '</div>');
                                                        $('div.modal-body .defender').append('<div class="result"></div>');
                                                        $('div.modal-body .defender').append('<div class="damage"></div>');
                                                        $('div.modal-body .defender').append('<div class="weapon"></div>');


                                                        $('#modalFight').modal({ show : 'true '});

                                                        var src_attacker = '';
                                                        var src_defender = '';

                                                        self.socket.emit('beginAttack', { 'attacker' : self.userId, 'attacker_weapon' : weapon, 'defender' : tile.status });
                                                        self.socket.on('fightStats', function(data) {
                                                            $('div.modal-body .attacker .bar').css('width', data.attacker + '%');
                                                            $('div.modal-body .defender .bar').css('width', data.defender + '%');

                                                            $('div.modal-body .attacker .damage').html('<h4>- ' + data.attacker_damage + ' HP</h4>');
                                                            $('div.modal-body .defender .damage').html('<h4>- ' + data.defender_damage + ' HP</h4>');

                                                            $('div.modal-body .attacker .damage').effect('shake', { times : 1, distance : 10});
                                                            $('div.modal-body .defender .damage').effect('shake', { times : 1, distance : 10});

                                                            self.socket.emit('getUserHealth', self.userId);

                                                            if(src_attacker == '') {
                                                                if(data.attacker_weapon == 'Fork') {
                                                                    src_attacker = '../assets/textures/weapons/fork.png';
                                                                } else if(data.attacker_weapon == 'Baseball Bat') {
                                                                    src_attacker = '../assets/textures/weapons/baseball.png';
                                                                } else if(data.attacker_weapon == 'Chainsaw') {
                                                                    src_attacker = '../assets/textures/weapons/chainsaw.png';
                                                                } else if(data.attacker_weapon == 'AK-47') {
                                                                    src_attacker = '../assets/textures/weapons/ak47.png';
                                                                }

                                                                $('div.modal-body .attacker .weapon').html('<img src="' + src_attacker + '"/>');
                                                            }

                                                            if(src_defender == '') {
                                                                if(data.defender_weapon == 'Fork') {
                                                                    src_defender = '../assets/textures/weapons/fork.png';
                                                                } else if(data.defender_weapon == 'Baseball Bat') {
                                                                    src_defender = '../assets/textures/weapons/baseball.png';
                                                                } else if(data.defender_weapon == 'Chainsaw') {
                                                                    src_defender = '../assets/textures/weapons/chainsaw.png';
                                                                } else if(data.defender_weapon == 'AK-47') {
                                                                    src_defender = '../assets/textures/weapons/ak47.png';
                                                                }

                                                                $('div.modal-body .defender .weapon').html('<img src="' + src_defender + '"/>');
                                                            }


                                                        });

                                                        self.socket.on('stopFight', function(data) {

                                                            src_defender = '';
                                                            src_attacker = '';

                                                            if(data.message == 'attacker') {
                                                                $('div.modal-body .attacker .result').html('<h4>You win !</h4>');
                                                                $('div.modal-body .defender .result').html('<h4>Defender lose !</h4>');

                                                                $('div.modal-footer').html('<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Close</button>');

                                                                $('div.modal-footer .btn').on('click', function() {
                                                                    $('div#modalFight .modal-header').remove();
                                                                    setTimeout(function() {
                                                                        $('div#modalFight').remove();
                                                                    }, 2000);
                                                                });

                                                                self.socket.emit('assignTileToPlayer', { 'player' : self.userId, 'tile_id' : tile._id });

                                                                self.socket.on('tileCaptured', function() {
                                                                    self.socket.emit('calculateUserLevel', self.userId);

                                                                    self.socket.on('returnUserLevel', function(user_level) {
                                                                        self.textureMap1.paintTile(tileObjectLayer.x, tileObjectLayer.y, self.texIndex, 4);

                                                                        clearInterval(blinkInterval);
                                                                        blinkInterval = null;
                                                                    });
                                                                });
                                                            } else if(data.message == 'defender') {
                                                                $('div.modal-body .attacker .result').html('<h4>You lose !</h4>');
                                                                $('div.modal-body .defender .result').html('<h4>Defender win !</h4>');

                                                                $('div.modal-footer').html('<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Close</button>');

                                                                $('div.modal-footer .btn').on('click', function() {
                                                                    setTimeout(function() {
                                                                        $('div#modalFight').remove();
                                                                    }, 2000);
                                                                });

                                                                self.socket.emit('calculateUserLevel', self.userId);

                                                                self.socket.on('returnUserLevel', function(user_level) {
                                                                    clearInterval(blinkInterval);
                                                                    blinkInterval = null;
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        $('.modal-body .message').html('<div class="alert alert-error"><strong>No no no !</strong> You didn\'t selected a weapon.</div>');
                                                    }

                                                });
                                            });
                                        }
                                    });
                                }

                                $('.iso-popup #cancel').on('click', function() {

                                    if($('.iso-popup.capture #attack-tile').length > 0) {
                                        self.textureMap1.paintTile(tileObjectLayer.x, tileObjectLayer.y, self.texIndex, 5);
                                        clearInterval(blinkInterval);
                                        blinkInterval = null;
                                    }

                                    $('.iso-popup.capture').toggle("slide", function() {
                                        $('div.iso-popup.capture').remove();
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

                self.objectBuildGrow[tile.position].removeFromMap(self.objectLayer);

                switch(tile.growing) {
                    case "Tomatoes":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Tomatoes(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level1":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Tomatoes_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level2":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Tomatoes_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level3":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Tomatoes_Level3(self.objectLayer, position[0], position[1]);
                        break;
                    case "Tomatoes_Level4":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Tomatoes_Level4(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Corn(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level1":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Corn_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level2":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Corn_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level3":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Corn_Level3(self.objectLayer, position[0], position[1]);
                        break;
                    case "Corn_Level4":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Corn_Level4(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Wheat(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level1":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Wheat_Level1(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level2":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Wheat_Level2(self.objectLayer, position[0], position[1]);
                        break;
                    case "Wheat_Level3":
                        self.objectBuildGrow[tile.position] = new ClientObjects.Wheat_Level3(self.objectLayer, position[0], position[1]);
                        break;
                }
            }

            if($('.iso-popup.information').length > 0 || $('.iso-popup.information-grow').length > 0) {
                var pos = $('.iso-popup').attr('id');

                if(pos == tile.position) {
                    $('.iso-popup .health').text(tile.health + ' %');
                    $('.iso-popup .humidity').text(tile.humidity + ' %');
                    $('.iso-popup .fertility').text(tile.fertility + ' %');

                    if($('.iso-popup.information-grow').length > 0) {
                        $('.iso-popup .time').text(tile.time + ' s');
                        $('.iso-popup .maturity').text(tile.maturity + ' %');
                    }
                }
            }
        });
    }
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }