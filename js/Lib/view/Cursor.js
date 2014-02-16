/* 
* @Author: kasper jensen
* @Date:   2014-02-15 19:36:07
* @Last Modified by:   kasper jensen
* @Last Modified time: 2014-02-15 19:49:12
*/

define(['PIXI'], function(PIXI){

	function myClass(assets) {
		var self = this;
		PIXI.DisplayObjectContainer.call(self);

		var cursor = assets.getCursorClip();
		cursor.animationSpeed = 0.3;
		cursor.play();
		self.addChild(cursor);
	}

	myClass.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
	myClass.prototype.constructor = myClass;

	return myClass;
});