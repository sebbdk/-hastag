/* 
* @Author: kasperjensen
* @Date:   2014-02-13 22:40:49
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-16 12:26:55
*/

define([
		'jquery',
		'mixin/EventDispatcher',
		'map/Tileset',
		'map/Imagelayer',
		'map/Objectlayer',
		'map/Tilelayer',
		'PIXI',
		'PathFinding'],
		function(
			$,
			EventDispatcher,
			Tileset,
			Imagelayer,
			Objectlayer,
			Tilelayer,
			PIXI,
			PF) {

	var Tilemap = function(path) {
		var self = this;
		self.mapData = null;
		self.layers = [];
		self.grid = null;
		self.finder = null;

		//extend the PIXI graphics object!
		PIXI.DisplayObjectContainer.call(this);

		//get the doc root
		var docRoot = path;
		docRoot = docRoot.split('/');
		docRoot.pop();
		self.docRoot = docRoot.join('/') + '/';

		//mix in some events
		EventDispatcher.mix(this);

		self.loadLevelData = function() {
			$.ajax(path, {
				type:'POST',
				dataType:'json'
			}).done(function(data, textStatus, jqXHR) {
				self.mapData = data;
				self.loadAssets();
				self.prepareFinder();
				self.trigger('map_loaded', data);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				throw "The tilemap could not be loaded";
			});
		};

		self.loadAssets = function() {
			var assets = [];

			//load some tilesets!
			self.mapData.tilesets.forEach(function(tileset) {
				tileset.image = self.docRoot + tileset.image;
				assets.push(tileset.image);
			});

			//load image layers
			self.mapData.layers.forEach(function(layer) {
				if(layer.type === 'imagelayer') {
					layer.image = self.docRoot + layer.image;
					assets.push(layer.image);
				}
			});

			var loader = new PIXI.AssetLoader(assets);
			loader.onComplete = self.onAssetsLoaded;
			loader.load();
		};

		self.onAssetsLoaded = function() {
			self.trigger('assets_loaded');

			self.tileset = new Tileset(self.mapData.tilesets, self);

			self.mapData.layers.forEach(function(layer) {
				var displayLayer = null;
				switch(layer.type) {
					case 'imagelayer':
						displayLayer = new Imagelayer(layer);
						break;
					case 'tilelayer':
						displayLayer = new Tilelayer(layer, self);
						break;
					case 'objectgroup':
						displayLayer = new Objectlayer(layer, self);
						break;
					default:
						//#TODO
						break;
				}

				if(displayLayer !== null) {
					self.layers.push(displayLayer);
					
					//HACITY HACKITY :D
					//self.addChild(displayLayer);
				}

			});
		};

		self.prepareFinder = function() {
			self.grid = [];
			//build a placeholder grid without blocked spots for now
			for(var x = 0; x < self.mapData.width; x++) {
				self.grid[x] = [];
				for(var y = 0; y < self.mapData.height; y++) {
					self.grid[x][y] = 0;
				}
			}

			//console.log(self.mapData.width, self.mapData.height);
			self.grid = new PF.Grid(self.mapData.height, self.mapData.width, self.grid);
			self.finder = new PF.AStarFinder();
		};

		self.findPath = function(fx, fy, tx, ty) {
			return self.finder.findPath(fx, fy, tx, ty, self.grid.clone());
		};

		self.touchstart  = self.mousedown = function(event) {
			var pos = event.getLocalPosition(self);
			event.coords = {
				x:Math.floor(pos.x/(32)),
				y:Math.floor(pos.y/(32))
			};

			self.trigger('click', event);
		};

		self.touchmove  = self.mousemove = function(event) {
			var pos = event.getLocalPosition(self);
			event.coords = {
				x:Math.floor(pos.x/(32)),
				y:Math.floor(pos.y/(32))
			};

			self.trigger('move', event);
		};

		self.setInteractive(true);
	};

	Tilemap.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	Tilemap.prototype.constructor = Tilemap;

	return Tilemap;
});