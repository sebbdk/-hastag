/* 
* @Author: kasper jensen
* @Date:   2014-02-15 13:36:18
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-16 09:42:29
*/

define(['PIXI', 'mixin/EventDispatcher'], function(PIXI, EventDispatcher) {
	function myClass(assets) {
		PIXI.DisplayObjectContainer.call(this);
		EventDispatcher.mix(this);
		var self = this;

		//create viewport
		var texture = assets.getTexture('assets/socialist_feed_screen.png');
		self.cameraport = new PIXI.Sprite(texture);
		self.cameraport.visible = true;
		self.cameraport.position.x = -32;
		self.cameraport.position.y = -32;
		self.addChild(self.cameraport);
		self.visible = false;

/*
		//create photograph button
		self.photoBtn = new PIXI.Graphics();
		self.photoBtn.beginFill(0xff0000);
		self.photoBtn.drawRect(0, 0, 32, 32);
		self.photoBtn.endFill();
		self.photoBtn.position.x = 96;
		self.photoBtn.position.y = 96;
		self.photoBtn.touchstart = self.photoBtn.mousedown = function(event) {
			self.trigger('take_photo');
		};
		self.photoBtn.hitArea = new PIXI.Rectangle(0, 0, 32, 32);
		self.photoBtn.setInteractive(true);

		self.cameraport.addChild(self.photoBtn);
*/


		//setup phone
		$('.phone').on('click', function() {
			self.trigger('open_camera');
		});

		$('.aim').on('mousedown touchstart', function() {
			
		});

	}

	myClass.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;
});