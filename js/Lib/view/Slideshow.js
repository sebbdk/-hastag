/* 
* @Author: kasper jensen
* @Date:   2014-02-16 11:03:30
* @Last Modified by:   kasperjensen
* @Last Modified time: 2014-02-16 13:11:08
*/

define(['PIXI', 'tween', 'jquery'], function(PIXI, Tween, $) {
	function myClass(assets) {
		var self = this;
		PIXI.DisplayObjectContainer.call(self);

		self.play = function(game) {
			var texture = assets.getTexture('assets/socialist_feed_screen.png');

			var frames = [];
			game.photos.forEach(function(photo) {
				var frame = new PIXI.Sprite(texture);
				frame.position.x = 3000;
				frame.position.y = game.player.view.position.y-80;

				photo.x = 32;
				photo.y = 32;

				frame.addChild(photo);
				self.addChild(frame);
				frames.push(frame);
			});

			function showNext() {
				if(frames.length > 0) {
					var frame = frames.pop();
					var t1 = new Tween(frame.position, "x", Tween.strongEaseIn, 1000, game.player.view.position.x - (288/2), 0.7);
					t1.start();

					setTimeout(function() {
						var t2 = new Tween(frame.position, "x", Tween.strongEaseIn, game.player.view.position.x - (288/2), -1000, 0.7);
						t2.start();
						showNext();
					}, 2000);
				} else {
					$('.gameover').fadeIn();
				}

				console.log('showing frame!!!');
			}

			showNext();
		};
	}

	myClass.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;
});