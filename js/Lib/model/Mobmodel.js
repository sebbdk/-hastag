/* 
* @Author: kasper jensen
* @Date:   2014-02-15 00:29:12
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-15 23:29:06
*/

define(['backbone', 'PathFinding'], function(Backbone, PathFinding) {
	return Backbone.Model.extend({
		defaults:{
			x:0,
			y:0,
			speed:0.04,
			ai:false,
			type:'bear',
			momentum:{
				x:0,
				y:0
			},
			path:[]
		},
		goTo:function(coords, tilemap) {
			var self = this;

			var oldpath = self.get('path');
			var goingTo = null;
			if(oldpath.length > 0) {
				goingTo = oldpath.shift();
			}

			var path = tilemap.findPath(Math.floor(self.get('x')), Math.floor(self.get('y')), coords.x, coords.y);

			if(goingTo) {
				path[0] = goingTo;
			} else {
				path.shift();
			}

			self.set({path:path});
		},
		update:function(game) {
			var self = this;

			if(self.get('inactive') === true) {
				return;
			}

			self.move();
			self.ai(game);
			self.view.update();
		},
		ai:function(game) {
			var self = this;
			if(self.get('ai')) {
				var path = self.get('path');
				var hasPath = path.length > 0;

				if(!hasPath) {
					var coords = {};
					coords.x = Math.floor(game.map.mapData.width * Math.random());
					coords.y = Math.floor(game.map.mapData.height * Math.random());
					self.goTo(coords, game.map);
				}
			}
		},
		move:function() {
			var self = this;
			var path = self.get('path');
			var hasPath = path.length > 0;
			var nextPos = hasPath ? {x:path[0][0], y:path[0][1]}:false;
			var dist = hasPath ? self.lineDistance( self.get('x'), self.get('y'), nextPos.x, nextPos.y ):0;

			//if has path and the dist is greater then X
			if( hasPath && dist >= self.get('speed') ) {
				var mov = { x:0, y:0 };
				if(nextPos.x > self.get('x')) {
					mov.x += self.get('speed');
				}

				if(nextPos.x < self.get('x')) {
					mov.x -= self.get('speed');
				}

				if(nextPos.y > self.get('y')) {
					mov.y += self.get('speed');
				}

				if(nextPos.y < self.get('y')) {
					mov.y -= self.get('speed');
				}

				self.set({
					x:self.get('x')+mov.x,
					y:self.get('y')+mov.y
				});
			} else if(hasPath) {
				self.set({
					x:nextPos.x,
					y:nextPos.y
				});

				path.shift();
			} else if(self.get('momentum').x !== 0 ||self.get('momentum').y !== 0) {
				self.set({
					x:self.get('x')+self.get('momentum').x*self.get('speed'),
					y:self.get('y')+self.get('momentum').y*self.get('speed')
				});
			}
		},
		lineDistance:function( x1, y1, x2, y2 ) {
			var xs = 0;
			var ys = 0;

			xs = x2 - x1;
			xs = xs * xs;

			ys = y2 - y1;
			ys = ys * ys;

			return Math.sqrt( xs + ys );
		}
	});
});