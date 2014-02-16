/* 
* @Author: kasperjensen
* @Date:   2014-02-13 22:10:36
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-16 05:54:28
*/

/**
 * RequireJS configuration
 * 
 * Configure libraries for use with 
 * requirejs AMD(Asynchronous Module Definition) style loading ,and their dependensies.
 */
requirejs.config({
	shim:{
		'PIXI': {
			exports: 'PIXI'
		},
		'backbone': {
			deps: ['underscore'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'socketio': {
			exports: 'io'
		},
		'soundjs': {
			exports: 'createjs'
		},
		'stats': {
			exports: 'Stats'
		}
	},
	baseUrl:'js/Lib',
	paths: {
		'underscore':'../vendor/underscore/underscore',
		'backbone':'../vendor/backbone/backbone',
		'jquery':'../vendor/jquery/jquery',
		'PIXI':'../vendor/pixi/bin/pixi.dev',
		'PathFinding':'../vendor/PathFinding.js/lib/pathfinding-browser',
		'stats':'../vendor/stats.js/build/stats.min',
		'soundjs':'../misc/soundjs-0.5.2.min'
	},
	urlArgs: 'bust=' + Date.now()
});

var Global = (function() {
	this.getTime = function() {
		return new Date().getTime();
	};
})();

/**
 * Action!
 * this is where the application logic starts
 */
requirejs(['view/Gameview', 'PIXI', 'jquery', 'stats', 'soundjs'], function(Gameview, PIXI, $, Stats, createjs) {

	$(document).ready(function() {
		// create an new instance of a pixi stage
		var stage = new PIXI.Stage(0xBBBBBB);

		// create a renderer instance
		var renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());

		// add the renderer view element to the DOM
		document.body.appendChild(renderer.view);

		$(renderer.view).hide();

		var gameview = new Gameview();
		stage.addChild(gameview);

		$('body').bind('touchmove', function (ev) { 
			ev.preventDefault();
		});

		//stats!
		var stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );

		/*if($(window).width() > 960) {
			function animate() {
				stats.begin();

				gameview.update();

				// render the stage
				renderer.render(stage);

				stats.end();
			}

			var loopInterval = setInterval(function() {
				requestAnimationFrame(animate);
			}, 30);

		} else {*/
			function animate() {
				stats.begin();

				gameview.update();
				window.requestAnimationFrame(animate);
				// render the stage
				renderer.render(stage);

				stats.end();
			}

			window.requestAnimationFrame(animate);
		//}
	});

});