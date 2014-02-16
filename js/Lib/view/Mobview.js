/* 
* @Author: kasper jensen
* @Date:   2014-02-15 00:26:06
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-15 23:31:37
*/

define(['PIXI'], function(PIXI) {
	function myClass(model, assets) {
		var self = this;
		PIXI.Graphics.call(this);

		self.types = {
			player:function() {
				self.rAnim = assets.getPlayerRightClip();
				self.rAnim.animationSpeed = 0.3;
				self.rAnim.visible = false;
				self.addChild(self.rAnim);

				self.lAnim = assets.getPlayerLeftClip();
				self.lAnim.animationSpeed = 0.3;
				self.lAnim.visible = false;
				self.addChild(self.lAnim);

				self.upAnim = assets.getPlayerUpClip();
				self.upAnim.animationSpeed = 0.3;
				self.upAnim.visible = false;
				self.addChild(self.upAnim);

				self.dAnim = assets.getPlayerDownClip();
				self.dAnim.animationSpeed = 0.3;
				self.dAnim.visible = true;
				self.addChild(self.dAnim);

				model.set({speed:0.08});
			},
			bear:function() {
				var con = new PIXI.DisplayObjectContainer();

				self.rAnim = assets.getBearRightClip();
				self.rAnim.animationSpeed = 0.3;
				self.rAnim.visible = false;
				self.rAnim.position.x = -17;
				self.rAnim.position.y = -26;
				con.addChild(self.rAnim);

				self.lAnim = assets.getBearLeftClip();
				self.lAnim.animationSpeed = 0.3;
				self.lAnim.visible = false;
				self.lAnim.position.x = -17;
				self.lAnim.position.y = -26;
				con.addChild(self.lAnim);

				self.upAnim = assets.getBearUpClip();
				self.upAnim.animationSpeed = 0.3;
				self.upAnim.visible = false;
				self.upAnim.position.x = -17;
				self.upAnim.position.y = -26;
				con.addChild(self.upAnim);

				self.dAnim = assets.getBearDownClip();
				self.dAnim.animationSpeed = 0.3;
				self.dAnim.visible = true;
				self.dAnim.position.x = -17;
				self.dAnim.position.y = -26;
				con.addChild(self.dAnim);

				self.deathAnim = assets.getBeardeath();
				self.deathAnim.animationSpeed = 0.3;
				self.deathAnim.visible = false;
				self.deathAnim.position.x = -17;
				self.deathAnim.position.y = -26;
				self.deathAnim.loop = false;
				con.addChild(self.deathAnim);

				self.addChild(con);
			},
			bullet:function() {
				var text = assets.getTexture('assets/Bullet.png');
				self.rAnim = new PIXI.Sprite(text);
				self.addChild(self.rAnim);

				self.lAnim = new PIXI.Sprite(text);
				self.addChild(self.lAnim);

				self.dAnim = new PIXI.Sprite(text);
				self.addChild(self.dAnim);

				self.upAnim = new PIXI.Sprite(text);
				self.addChild(self.upAnim);
			}

		};
			
		switch(model.get('type')) {
			case 'bear':
				self.types.bear();
				break;
			case 'player':
				self.types.player();
				break;
			case 'bullet':
				self.types.bullet();
				break;
		}

		self.die = function(game) {
			model.set({inactive:true});

			if(self.deathAnim) {
				self.upAnim.visible = false;
				self.dAnim.visible = false;
				self.lAnim.visible = false;
				self.rAnim.visible = false;

				self.deathAnim.visible = true;
				self.deathAnim.play();
				self.deathAnim.onComplete = function() {
					setTimeout(function() {
						game.mobs.remove(model);
					}, 5000);
				};
			}
		};

		self.update = function() {

			self.position.x = model.get('x') * 32;
			self.position.y = model.get('y') * 32;

			var path = model.get('path');
			var hasPath = path.length > 0;
			var nextPos = hasPath ? {x:path[0][0], y:path[0][1]}:false;

			if(nextPos && model.get('type') !== 'bullet') {
				if(nextPos.x > model.get('x')) {
					self.rAnim.visible = true;
					self.rAnim.play();
				} else {
					self.rAnim.visible = false;
				}

				if(nextPos.x < model.get('x')) {
					self.lAnim.visible = true;
					self.lAnim.play();
				} else {
					self.lAnim.visible = false;
				}

				if(nextPos.y > model.get('y')) {
					self.dAnim.visible = true;
					self.dAnim.play();
				} else {
					self.dAnim.visible = false;
				}

				if(nextPos.y < model.get('y')) {
					self.upAnim.visible = true;
					self.upAnim.play();
				} else {
					self.upAnim.visible = false;
				}
			} else {
				if(self.rAnim.gotoAndStop) {
					self.rAnim.gotoAndStop(0);
					self.lAnim.gotoAndStop(0);
					self.upAnim.gotoAndStop(0);
					self.dAnim.gotoAndStop(0);
				}
			}
		};
	}

	myClass.prototype = Object.create( PIXI.Graphics.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;
});