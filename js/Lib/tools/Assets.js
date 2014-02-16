/* 
* @Author: kasper jensen
* @Date:   2014-02-15 11:09:19
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-16 02:28:55
*/

var _assets = {};
define(['PIXI', 'mixin/EventDispatcher'], function(PIXI, EventDispatcher) {

	var assetsToLoad = [
		'assets/Sharer_Sprite_Sheet.png',
		'assets/Bear_Sprite_Sheet.png',
		'assets/camera_viewport.png',
		'assets/photograph.png',
		'assets/Temp_Cursor_Sheet.png',
		'assets/Bullet.png',
		'assets/Bear_Death_Sheet.png'
	];

	var myClass = function() {
		var self = this;
		EventDispatcher.mix(self);

		self.load = function() {
			var loader = new PIXI.AssetLoader(assetsToLoad);
			loader.onComplete = self.onAssetsLoaded;
			loader.load();
		};

		self.onAssetsLoaded = function() {
			self.trigger('loaded');

			var tilesheet = new PIXI.Texture.fromImage('assets/Bear_Sprite_Sheet.png');
			self.brcr1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 192, 64, 64));
			self.brcr2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 192, 64, 64));
			self.brcr3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(128, 192, 64, 64));
			self.brcr4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(192, 192, 64, 64));

			tilesheet = new PIXI.Texture.fromImage('assets/Bear_Sprite_Sheet.png');
			self.blcr1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 64, 64, 64));
			self.blcr2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 64, 64, 64));
			self.blcr3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(128, 64, 64, 64));
			self.blcr4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(192, 64, 64, 64));

			tilesheet = new PIXI.Texture.fromImage('assets/Bear_Sprite_Sheet.png');
			self.bucr1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 128, 64, 64));
			self.bucr2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 128, 64, 64));
			self.bucr3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(128, 128, 64, 64));
			self.bucr4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(192, 128, 64, 64));

			tilesheet = new PIXI.Texture.fromImage('assets/Bear_Sprite_Sheet.png');
			self.bdcr1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 0, 64, 64));
			self.bdcr2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 0, 64, 64));
			self.bdcr3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(128, 0, 64, 64));
			self.bdcr4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(192, 0, 64, 64));

			tilesheet = new PIXI.Texture.fromImage('assets/Bear_Death_Sheet.png');
			self.bdr1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 0, 64, 64));
			self.bdr2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 0, 64, 64));
			self.bdr3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(128, 0, 64, 64));
			self.bdr4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(192, 0, 64, 64));
			self.bdr5 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(256, 0, 64, 64));
			self.bdr6 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(320, 0, 64, 64));
		};

		self.getTexture = function(path) {
			return new PIXI.Texture.fromImage(path);
		};

		self.getCursorClip = function() {
			var tilesheet = new PIXI.Texture.fromImage('assets/Temp_Cursor_Sheet.png');
			
			var r1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 0, 32, 32));
			var r2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(32, 0, 32, 32));
			var r3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 0, 32, 32));
			var r4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(96, 0, 32, 32));

			return new PIXI.MovieClip([r1,r2,r3,r4]);
		};

		//BEAR
		self.getBeardeath = function() {
			return new PIXI.MovieClip([self.bdr1, self.bdr2, self.bdr3, self.bdr4, self.bdr5, self.bdr6]);
		};

		self.getBearRightClip = function() {
			return new PIXI.MovieClip([self.brcr1, self.brcr2, self.brcr3, self.brcr4]);
		};

		self.getBearLeftClip = function() {
			return new PIXI.MovieClip([self.blcr1, self.blcr2, self.blcr3, self.blcr4]);
		};

		self.getBearUpClip = function() {
			return new PIXI.MovieClip([self.bucr1, self.bucr2, self.bucr3, self.bucr4]);
		};

		self.getBearDownClip = function() {
			return new PIXI.MovieClip([self.bdcr1, self.bdcr2, self.bdcr3, self.bdcr4]);
		};
		//BEAR END

		self.getPlayerRightClip = function() {
			var tilesheet = new PIXI.Texture.fromImage('assets/Sharer_Sprite_Sheet.png');
			
			var r1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 64, 32, 32));
			var r2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(32, 64, 32, 32));
			var r3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 64, 32, 32));
			var r4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(96, 64, 32, 32));

			return new PIXI.MovieClip([r1,r2,r3,r4]);
		};

		self.getPlayerLeftClip = function() {
			var tilesheet = new PIXI.Texture.fromImage('assets/Sharer_Sprite_Sheet.png');
			
			var r1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 96, 32, 32));
			var r2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(32, 96, 32, 32));
			var r3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 96, 32, 32));
			var r4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(96, 96, 32, 32));

			return new PIXI.MovieClip([r1,r2,r3,r4]);
		};

		self.getPlayerUpClip = function() {
			var tilesheet = new PIXI.Texture.fromImage('assets/Sharer_Sprite_Sheet.png');
			
			var r1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 32, 32, 32));
			var r2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(32, 32, 32, 32));
			var r3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 32, 32, 32));
			var r4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(96, 32, 32, 32));

			return new PIXI.MovieClip([r1,r2,r3,r4]);
		};

		self.getPlayerDownClip = function() {
			var tilesheet = new PIXI.Texture.fromImage('assets/Sharer_Sprite_Sheet.png');
			
			var r1 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(0, 0, 32, 32));
			var r2 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(32, 0, 32, 32));
			var r3 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(64, 0, 32, 32));
			var r4 = new PIXI.Texture(tilesheet,
				new PIXI.Rectangle(96, 0, 32, 32));

			return new PIXI.MovieClip([r1,r2,r3,r4]);
		};
	};

	return myClass;

});