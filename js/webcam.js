

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// webcam
// captures and saves pics from webcam hd input
// translate original coloured source to b&w via canvas


var vWidth = 1080,
	vHeight = 720,
	video,
	canvas,
	back,
	context,
	backcontext,
	stream,
	camTimeOut;


// b&w : gray or treshold
var camTreshold = true;
				
var webcam = {
	init : function(){

		$webcam = $('<div id="webcam"></div>');
		$currentPage.prepend($webcam);
		video = document.createElement('video'),
		canvas = document.createElement('canvas'),
		back = document.createElement('canvas'),
		video.id = 'video';
		canvas.id = 'canvas';
		back.id = 'backcanvas';
		context = canvas.getContext('2d'),
		backcontext = back.getContext('2d'),
		$webcam.append(video, canvas, back);
		

  		document.mode = "webcam";

		canvas.width = back.width = video.width = vWidth ;
		canvas.height = back.height = video.height = vHeight ;
		
		

		// canvases and video in popup 
		//popup.show();		
		// canvases and video in page
		
		

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		function successCallback(stream) {
			window.stream = stream; // stream available to console
			video.src = window.URL.createObjectURL(stream);
			video.play();

			// Weird timeout need
			var t = setTimeout(function(){
				webcam.draw();
			},2000)
		}

		function errorCallback(error){
		  	console.log("navigator.getUserMedia error: ", error);
		}

		// webrtc getUserMedia
		function getMedia(){
		  	if (!!stream) {
		    	video.src = null;
		    	stream.stop();
		  	}
		 	navigator.getUserMedia({video: {
 		    	mandatory: {
 		      		width: 1080,
 		      		height:720
 		    	}
 		  	}}, successCallback, errorCallback);
		}

	    getMedia();
	},
	/*
	var grayscale = Filters.filterImage(Filter.grayscale, image);
	// Note that ImageData values are clamped between 0 and 255, so we need
	// to use a Float32Array for the gradient values because they
	// range between -255 and 255.
	var vertical = Filters.convoluteFloat32(grayscale,
	  [ -1, 0, 1,
	    -2, 0, 2,
	    -1, 0, 1 ]);
	var horizontal = Filters.convoluteFloat32(grayscale,
	  [ -1, -2, -1,
	     0,  0,  0,
	     1,  2,  1 ]);
	var final_image = Filters.createImageData(vertical.width, vertical.height);
	for (var i=0; i<final_image.data.length; i+=4) {
	  // make the vertical gradient red
	  var v = Math.abs(vertical.data[i]);
	  final_image.data[i] = v;
	  // make the horizontal gradient green
	  var h = Math.abs(horizontal.data[i]);
	  final_image.data[i+1] = h;
	  // and mix in some blue for aesthetics
	  final_image.data[i+2] = (v+h)/4;
	  final_image.data[i+3] = 255; // opaque alpha
	}
	*/
	// video copy in b&w
	draw : function() {
	 	try {
  
		    backcontext.drawImage(video, 0, 0, vWidth, vHeight);
		    var apx = backcontext.getImageData(0, 0, vWidth, vHeight);
		    var data = apx.data;
		    var adjustment = 25;
		 
		    for(var i = 0; i < data.length; i+=4){
		        var r = data[i] + adjustment,
		            g = data[i+1] + adjustment,
		            b = data[i+2] + adjustment,
		            // gray or treshold
		            gray = 0.2126*r + 0.7152*g + 0.0722*b 
		            if (camTreshold){
						gray = (0.2126*(r + adjustment) + 0.7152*(g + adjustment) + 0.0722*(b + adjustment) >= 125) ? 255 : 0
		            } 
		            
			    data[i] = data[i+1] = data[i+2] = gray
		    }
		    apx.data = data;
		    context.putImageData(apx, 0, 0);
		 
		 	// recursive
		    camTimeOut = setTimeout(function() {
		        webcam.draw();
		    }, 50);
		} catch (e) {
    		if (e.name == "NS_ERROR_NOT_AVAILABLE") {
      			camTimeOut = setTimeout(webcam.draw, 0);
    		} else {
      		throw e;
    	}
  }
	},

	stopCam : function() {
		//video.src = window.URL.createObjectURL(null);
		window.URL.revokeObjectURL(stream);
		stream.stop()
		clearTimeout(camTimeOut);
		$webcam = $('#webcam');
    	$('#webcam').remove();
	        
	},

	// save pic 
	takepicture : function() {
		var d = new Date();
    	var filename = 'cam-' + ISODateString(d) + '.png';
	    //context.drawImage(back, 0, 0, vWidth, vHeight);
	    var dataURL = canvas.toDataURL('image/png');
	    $img = $('<img class="camview" src="' + dataURL.replace("image/png", "image/octet-stream") + '" >');

    	$currentPage.prepend($img);
    	$img.width(vWidth * 3.2)
    	
    	webcam.stopCam();
    	document.mode = 'layout';

	    $.post("webcamcanvasdata.php", { data: dataURL, filename:filename}, function( dataURL ) {
	    	
	    	
	    });   
	    
  	}

}
