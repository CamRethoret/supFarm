var ClientObjects = {
    Silo: IgeEntity.extend({
        classId: 'Silo',
        type: 'Building',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.silo;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(0.7,0.7,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Barn: IgeEntity.extend({
        classId: 'Barn',
        type: 'Building',
        widthInTile: 2,
        heightInTile: 2,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.barn;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(0.7,0.7,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Cold: IgeEntity.extend({
        classId: 'Cold',
        type: 'Building',
        widthInTile: 2,
        heightInTile: 3,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.cold_storage;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(0.8,0.8,1)
                .originTo(0.3,0.7,0.5)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Tomatoes: IgeEntity.extend({
        classId: 'Tomatoes',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.tomatoes;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.4,1.5,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Tomatoes_Level1: IgeEntity.extend({
        classId: 'Tomatoes_Level1',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.tomatoes_level1;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.7,2,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Tomatoes_Level2: IgeEntity.extend({
        classId: 'Tomatoes_Level2',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.tomatoes_level2;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.3,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Tomatoes_Level3: IgeEntity.extend({
        classId: 'Tomatoes_Level3',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.tomatoes_level3;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.55,0.8,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Tomatoes_Level4: IgeEntity.extend({
        classId: 'Tomatoes_Level4',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.tomatoes_level4;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,0.8,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Corn: IgeEntity.extend({
        classId: 'Corn',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.corn;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.4,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Corn_Level1: IgeEntity.extend({
        classId: 'Corn_Level1',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.corn_level1;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.7,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Corn_Level2: IgeEntity.extend({
        classId: 'Corn_Level2',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.corn_level2;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,0.7,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Corn_Level3: IgeEntity.extend({
        classId: 'Corn_Level3',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.corn_level3;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,0.5,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Corn_Level4: IgeEntity.extend({
        classId: 'Corn_Level4',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.corn_level4;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,0.5,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Wheat: IgeEntity.extend({
        classId: 'Wheat',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.wheat;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1.5,1.5,2)
                .originTo(0.5,1,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Wheat_Level1: IgeEntity.extend({
        classId: 'Wheat_Level1',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.wheat_level1;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.5,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Wheat_Level2: IgeEntity.extend({
        classId: 'Wheat_Level2',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.wheat_level2;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.3,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    }),
    Wheat_Level3: IgeEntity.extend({
        classId: 'Wheat_Level3',
        type: 'Growing',
        widthInTile: 1,
        heightInTile: 1,

        init: function(parent, tileX, tileY) {
            IgeEntity.prototype.init.call(this, tileX, tileY, 2, 2);
            var self = this;

            this.isometric(true)
                .mount(parent)
                .size3d(this.widthInTile * parent._tileWidth, this.heightInTile * parent._tileHeight, 40)
                .translateToTile((tileX), (tileY), 0)
                .drawBounds(false)
                .drawBoundsData(false);

            this.tileX = tileX;
            this.tileY = tileY;
            parent.occupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 0);

            var texture = ige.client.gameTexture.wheat_level3;

            this.imageEntity = new IgeEntity()
                .texture(texture)
                .dimensionsFromCell()
                .scaleTo(1,1,1)
                .originTo(0.5,1.2,1)
                .drawBounds(false)
                .drawBoundsData(false)
                .mount(this);
        },

        removeFromMap: function(parent) {
            this.unMount();
            parent.unOccupyTile(this.tileX, this.tileY, this.widthInTile, this.heightInTile, 1);
        }
    })
};