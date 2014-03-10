

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// webcam
// captures and saves pics from webcam hd input
// translate original coloured source to b&w via canvas

// draw video to backcanvas
// capture backcanvas to canvas ?


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


		// flip horizontal
		backcontext.translate(vWidth, 0);
		backcontext.scale(-1, 1);

		// gum
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
		//window.URL.revokeObjectURL(stream);
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
