var openWindows = {};

// http://www.geekdaily.net/2007/07/04/javascript-cross-browser-window-size-and-centering/
window.size = function()
{
	var w = 0;
	var h = 0;

	//IE
	if(!window.innerWidth)
	{
		//strict mode
		if(!(document.documentElement.clientWidth == 0))
		{
			w = document.documentElement.clientWidth;
			h = document.documentElement.clientHeight;
		}
		//quirks mode
		else
		{
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
	}
	//w3c
	else
	{
		w = window.innerWidth;
		h = window.innerHeight;
	}
	return {width:w,height:h};
}

// http://www.geekdaily.net/2007/07/04/javascript-cross-browser-window-size-and-centering/
window.center = function()
{
	var hWnd = (arguments[0] != null) ? arguments[0] : {width:0,height:0};

	var _x = 0;
	var _y = 0;
	var offsetX = 0;
	var offsetY = 0;

	//IE
	if(!window.pageYOffset)
	{
		//strict mode
		if(!(document.documentElement.scrollTop == 0))
		{
			offsetY = document.documentElement.scrollTop;
			offsetX = document.documentElement.scrollLeft;
		}
		//quirks mode
		else
		{
			offsetY = document.body.scrollTop;
			offsetX = document.body.scrollLeft;
		}
	}
	//w3c
	else
	{
		offsetX = window.pageXOffset;
		offsetY = window.pageYOffset;
	}

	_x = ((this.size().width-hWnd.width)/2)+offsetX;
	_y = ((this.size().height-hWnd.height)/2)+offsetY;

	return{x:_x,y:_y};
}

window.pos = function() {
	if (window.screenX) {
		return {x:window.screenX, y:window.screenY};
	} else if (window.screenLeft) {
		return {x:window.screenLeft, y:window.screenTop};
	} else {
		throw new Error("window.pos() could not measure window.");
	}
}

function alertIfBelowMinSpecs(minColorBitDepth, minScreenPixelWidth, minScreenPixelHeight) {
	var bitDepth = window.screen.colorDepth;
	var screenW = window.screen.width;
	var screenH = window.screen.height;
	if (bitDepth < minColorBitDepth || screenW < minScreenPixelWidth || screenH < minScreenPixelHeight) {
		alert("This application is best viewed at " + minScreenPixelWidth + "x" + minScreenPixelHeight + " pixels and " + minColorBitDepth + "-bit color or above. You may need to modify your screen settings to access all features.")
	}
}

function openWindow(winUrl, winName, winType, winFeatures) {
	var win = openWindows[winName];
	if (win != null && win.closed != true) win.close();
	var wf = {};
	if (winFeatures == null) {
		var myPos = window.pos();
		var mySize = window.size();
		var myCenter = window.center();
		var dy = 0;
		switch (winType) {
			case "centered.inside.viewport":
				wf.width = mySize.width - 100;
				wf.height = mySize.height - 100;
				wf.screenX = wf.left = myPos.x + myCenter.x - wf.width/2;
				wf.screenY = wf.top = myPos.y + myCenter.y - wf.height/2;
				// adjust win.top: win ff -20px; mac ff -10px; win msie -70px
				if (isFirefox()) dy = (isWin()) ? -20 : -10;
				if (isWin() && isMsie()) dy = -70;
				wf.screenY = wf.top = wf.top + dy;
				wf.scrollbars = 1;
				break;
		}
		winFeatures = winFeaturesObjToStr(wf);
	}
	win = window.open(winUrl, winName, winFeatures);
	openWindows[winName] = win;
	setTimeout("focusWindow('" + winName + "')", 100);
}

function focusWindow(winName) {
	// alert("focusWindow: " + openWindows[winName]);
	openWindows[winName].focus();
}

function winFeaturesObjToStr(obj) {
	var s = "";
	for (var p in obj) {
		if (s.length > 0) s += ",";
		s += p + "=" + obj[p];
	}
	return s;
}

function isWin() {
	return navigator.userAgent.toLowerCase().indexOf('windows') > -1;
}

function isChrome() {
	return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

function isSafari() {
	return navigator.userAgent.toLowerCase().indexOf('safari') > -1
		&& navigator.userAgent.toLowerCase().indexOf('chrome') == -1;
}

function isFirefox() {
	return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function isMsie() {
	return navigator.appName == 'Microsoft Internet Explorer';
}