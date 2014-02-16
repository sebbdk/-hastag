/* 
* @Author: kasper jensen
* @Date:   2014-02-15 00:00:32
* @Last Modified by:   kasperjensen
* @Last Modified time: 2014-02-16 13:10:49
*/

define(['PIXI', 'map/Tilemap', 'backbone', 'view/Mobview',
		'model/Mobmodel', 'controller/Playercontroller', 'tools/Assets', 'jquery',
		'view/Interface', 'view/Cursor', 'view/Slideshow'], function(
			PIXI, Tilemap, Backbone,
			Mobview, Mobmodel, Playercontroller, Assets, $, Interface, Cursor, Slidershow) {

	function myClass(layerData) {
		PIXI.DisplayObjectContainer.call(this);

		var self = this;
		self.player = null;
		self.paused = true;
		self.score = 0;

		self.scale.x = 2;
		self.scale.y = 2;

		if($(window).width() < 600) {
			self.scale.x = 1;
			self.scale.y = 1;
		}

		self.photos = [];

		self.mobContainer = new PIXI.DisplayObjectContainer();

		//set up the map
		self.map = new Tilemap('maps/demo_level/level.json');
		self.map.loadLevelData();
		self.addChild(self.map);

		//load assets 
		var assets = new Assets();
		assets.load();
		
		assets.on('loaded', function() {
			//set up interface
			self.interface = new Interface(assets);
			self.interface.on('open_camera', function() {
				console.log(self.interface.cameraport);
				self.interface.cameraport.visible = self.interface.cameraport.visible ? false:true;
			});

			$('.start-btn').on('click touchstart', function() {
				self.start();
			});

			self.player = new Mobmodel({type:'player', x:8, y:8});
			mobs.add(self.player);

			self.cursor = new Cursor(assets);
			self.addChild(self.cursor);

			//set up player controller
			var playercontroller = new Playercontroller(self);


			var ground = assets.getTexture('assets/level.png');
			var groundSprite = new PIXI.Sprite(ground);
			self.map.addChild(groundSprite);
		});

		self.start = function() {
			createjs.Sound.registerSound("assets/song.mp3", '#bg', 1);
			createjs.Sound.addEventListener("fileload", function(evt) {
				var instance = createjs.Sound.play("#bg");
				instance.volume = 0.2;
				instance.addEventListener("complete", function() {
					instance.play();
				});
			});

			self.paused = false;
			$('.start-btn').fadeOut();
			$('.start').removeClass('start');
			$('.score').fadeIn();
			self.addChild(self.mobContainer);

			var shade = assets.getTexture('assets/shade.png');
			var ShadeSprite = new PIXI.Sprite(shade);
			self.addChild(ShadeSprite);

			self.addChild(self.interface);

			$('canvas').fadeIn();
		};

		//set up mob collections
		var mobs = new Backbone.Collection();
		self.mobs = mobs;
		mobs.on('add', function(model) {
			var mob = new Mobview(model, assets);
			model.view = mob;
			self.mobContainer.addChild(mob);
		});

		mobs.on('remove', function(model) {
			self.mobContainer.removeChild(model.view);
		});

		self.takePhoto = function() {
			self.interface.visible = true;
			self.paused = true;

			var photo = new PIXI.RenderTexture(1024, 1024);
			photo.render(self);

			photo.setFrame(new PIXI.Rectangle(
				self.player.view.position.x-96,
				self.player.view.position.y-64,
				224,
				96
			));

			mobs.forEach(function(mob) {
				if(mob.get('x')*32 > self.player.view.position.x-96 &&
					mob.get('y')*32 > self.player.view.position.y-96 &&
					mob.get('x')*32 < self.player.view.position.x+96 &&
					mob.get('y')*32 < self.player.view.position.y+96) {

					if(mob.get('fdead') !== true && mob.get('dead') === true) {
						self.score += 10;
						mob.set({fdead:true});
					}

					if(mob.get('flive') !== true) {
						self.score += 5;
						mob.set({flive:true});
					}

				}
			});
			
			var sprite = new PIXI.Sprite(photo);
			self.interface.addChild(sprite);
			self.photos.push(sprite);

			setTimeout(function() {
				self.interface.removeChild(sprite);
				self.interface.visible = false;
				self.paused = false;
			}, 1000);
		};

		function lineDistance( x1, y1, x2, y2 ) {
			var xs = 0;
			var ys = 0;

			xs = x2 - x1;
			xs = xs * xs;

			ys = y2 - y1;
			ys = ys * ys;

			return Math.sqrt( xs + ys );
		}

		//update!
		var mobSpeed = 0.03;
		var mobSpeedInc = 1.1;
		self.update = function() {
			if(self.paused) {
				return;
			}

			mobs.forEach(function(mob) {
				mob.update(self);

				if(mob.get('type') === 'bear' && mob.get('type') !== 'player') {
					if(mob.get('inactive') !== true && lineDistance(mob.get('x'), mob.get('y'), self.player.get('x'), self.player.get('y')) < 0.5) {
						self.paused = true;

						var slideshow = new Slidershow(assets);
						slideshow.play(self);
						self.addChild(slideshow);
					}
				}

				if(mob.get('type') === 'bullet') {

					mobs.forEach(function(bear) {
						if(bear.get('type') === 'bear') {
							if(!mob.get('disabled') && lineDistance(bear.get('x'), bear.get('y'), mob.get('x'), mob.get('y')) < 1) {
								mob.set({disabled:true});
								mobs.remove(mob);
								bear.view.die(self);
								self.score += 10;
							}
						}
					});

				}
			});

			$('.score span').html(self.score);

			self.updateCam();

			if(mobs.length < 5) {
				if(mobSpeed < 1) {
					mobSpeed *= mobSpeedInc;
				}

				var pos = {
					x:Math.floor(self.map.mapData.width*Math.random()),
					y:Math.floor(self.map.mapData.height*Math.random())
				};

				if( lineDistance(pos.x, pos.y, self.player.get('x'), self.player.get('y')) < 4 ) {
					return;
				}

				mobs.add(new Mobmodel({
					ai:true,
					x:pos.x,
					y:pos.y,
					speed:mobSpeed,
					type:'bear'
				}));
			}
		};

		self.updateCam = function() {
			if(self.player) {
				self.position.x = (-16-self.player.view.position.x) * self.scale.x + $(document).width()/2;
				self.position.y = (-16-self.player.view.position.y) * self.scale.y + $(document).height()/2;

				if(self.interface) {
					self.interface.position.x = self.player.view.position.x - 96;
					self.interface.position.y = self.player.view.position.y - 64;
				}
			}
		};

		self.reset = function() {
			//#TODO
		};
	}

	myClass.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;

});