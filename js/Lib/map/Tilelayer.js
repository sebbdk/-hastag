/* 
* @Author: kasperjensen
* @Date:   2014-02-13 22:59:52
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-15 12:55:56
*/

define(['PIXI'], function(PIXI) {

	function myClass(layerData, map) {
		var self = this;
		self.layerData = layerData;

		PIXI.DisplayObjectContainer.call(this);

		var renderTexture = new PIXI.RenderTexture(map.mapData.width*32, map.mapData.height*32);
		// create a sprite that uses the new render texture...
		// and add it to the stage
		var sprite = new PIXI.Sprite(renderTexture);
		self.addChild(sprite);

		var doc = new PIXI.DisplayObjectContainer();

		parse();

		function parse() {
			var tiles = [];
			
			var index = 0;
			layerData.data.forEach(function(tid) {
				if(tid !== 0) {
					//calculate x and y coords
					var x = (index % map.mapData.width) * map.mapData.tilewidth;
					var y = Math.floor(index / map.mapData.width) * map.mapData.tileheight;
					//console.log(x,y,index);
					var texture = map.tileset.getTileTexture(tid);
					var sprite = new PIXI.Sprite(texture);
					sprite.position.x = x;
					sprite.position.y = y;
					doc.addChild(sprite);
				}

				index++;
			});

			renderTexture.render(doc);
		}
	}

	myClass.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;
});