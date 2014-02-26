

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// webcam
// captures and saves pics from webcam hd input
// translate original coloured source to b&w via canvas


var vWidth = 1080,
	vHeight = 720,
	video = document.getElementById('video'),
	canvas = document.getElementById('canvas'),
	back = document.getElementById('backcanvas'),
	context = canvas.getContext('2d'),
	backcontext = back.getContext('2d'),
	stream;

// b&w : gray or treshold
var camTreshold = true;
				
var webcam = {
	init : function(){
	
  		document.mode = "webcam";

		canvas.width = vWidth;
		canvas.height = vHeight;
		back.width = vWidth;
		back.height = vHeight;

		// canvases and video in popup 
		popup.show();		

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
	 
	    backcontext.drawImage(video, 0, 0, vWidth, vHeight);
	    var apx = backcontext.getImageData(0, 0, vWidth, vHeight);
	    var data = apx.data;
	 
	    for(var i = 0; i < data.length; i+=4){
	        var r = data[i],
	            g = data[i+1],
	            b = data[i+2],
	            // gray or treshold
	            gray = camTreshold == true ? ((0.2126*r + 0.7152*g + 0.0722*b >= 125) ? 255 : 0) : (r+g+b)/3;
		    data[i] = data[i+1] = data[i+2] = gray
	    }
	    apx.data = data;
	    context.putImageData(apx, 0, 0);
	 
	 	// recursive
	    setTimeout(function() {
	        webcam.draw();
	    }, 20);
	},

	// save pic 
	takepicture : function() {
		var d = new Date();
    	var filename = 'cam-' + ISODateString(d);
	    context.drawImage(video, 0, 0, vWidth, vHeight);
	    var dataURL = canvas.toDataURL('image/png');
	    $.post("webcamcanvasdata.php", { data: dataURL, filename:filename} );   
	    
  	}

}
