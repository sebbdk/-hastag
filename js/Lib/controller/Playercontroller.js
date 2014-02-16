/* 
* @Author: kasper jensen
* @Date:   2014-02-15 00:08:34
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-15 23:56:48
*/

define(['jquery', 'model/Mobmodel'], function($, Mobmodel) {

	return function(game) {

		game.map.on('move', function(arg) {
			game.cursor.position.x = arg.data.coords.x * 32;
			game.cursor.position.y = arg.data.coords.y * 32;
		});

		game.interface.on('take_photo', function() {
			game.takePhoto();
		});

		game.map.on('click', function(evt, data) {
			game.cursor.position.x = evt.data.coords.x * 32;
			game.cursor.position.y = evt.data.coords.y * 32;

			if(evt.data.coords.x === game.player.get('x') && evt.data.coords.y === game.player.get('y'))  {
				evt.data.coords.y -= 1;
			}
			game.player.goTo(evt.data.coords, game.map);
		});

		var keysHeld = {};

		$(document).on('keyup', function(evt) {
			keysHeld[evt.keyCode] = false;

			if(evt.keyCode === 32) {
				game.takePhoto();
			}
		});

		var lastShot = 0;
		function shoot(dir) {
			if(new Date().getTime() - lastShot < 400) {
				return;
			}

			var mob = new Mobmodel({
				type:'bullet',
				speed:0.2,
				x:Math.floor(game.player.get('x')),
				y:Math.floor(game.player.get('y')),
				momentum:dir
			});

			game.mobs.add(mob);

			setTimeout(function() {
				game.mobs.remove(mob);
			}, 2000);

			lastShot = new Date().getTime();
		}

		$('.aim-btn.top').on('click touchstart', function() {
			shoot({x:0,y:-1});
		});

		$('.aim-btn.bottom').on('click touchstart', function() {
			shoot({x:0,y:1});
		});

		$('.aim-btn.left').on('click touchstart', function() {
			shoot({x:-1,y:0});
		});

		$('.aim-btn.right').on('click touchstart', function() {
			shoot({x:1,y:0});
		});

		$('.cam').on('click touchstart', function() {
			game.takePhoto();
		});

		$(document).on('keydown', function(evt) {
			var time = new Date().getTime();
			var coords = {
				x:game.player.get('x'),
				y:game.player.get('y')
			};

			if(keysHeld[evt.keyCode] === undefined || keysHeld[evt.keyCode] === false) {
				keysHeld[evt.keyCode] = time;
			}

			var moveTimeLagg = 1;
			switch(evt.keyCode) {
				//movement
				case 68://d
					shoot({x:1,y:0});
					break;
				case 65://a
					shoot({x:-1,y:0});
					break;
				case 87://w
					shoot({x:0,y:-1});
					break;
				case 83://s
					shoot({x:0,y:1});
					break;


					//


				case 39://right
					if(time-keysHeld[evt.keyCode] > moveTimeLagg) {
						coords.x +=1;
						game.player.goTo(coords, game.map);
					}
					break;
				case 38://up
					if(time-keysHeld[evt.keyCode] > moveTimeLagg) {
						coords.x -=1;
						game.player.goTo(coords, game.map);
					}
					break;
				case 37://left
					if(time-keysHeld[evt.keyCode] > moveTimeLagg) {
						coords.y -=1;
						game.player.goTo(coords, game.map);
					}
					break;
				case 40://down
					if(time-keysHeld[evt.keyCode] > moveTimeLagg) {
						coords.y +=1;
						game.player.goTo(coords, game.map);
					}
					break;
				//shooting
			}
		});
	};

});