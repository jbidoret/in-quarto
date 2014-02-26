

// mdé - in-quarto


// periodically poll server to grag new inputs

var longpoll = {
	
	sms :{
		poll : function(){
			var timestamp=null;
			$.ajax({
				type: "GET",
				url: "_sms/poll.php?timestamp=" + timestamp,
				async: true,
				cache: false,
				 
				success: function(data){
					var json=eval('('+data+ ')');
					if (json['message'] !="") {
						sms.newSMS(json['message']);
					}
					timestamp =json["timestamp"];
					//setTimeout(longpoll.sms.poll,1000);
				},
				error: function(XMLHttpRequest,textStatus,errorThrown) {
				// alert("error: "+textStatus + " "+ errorThrown );
				setTimeout(longpoll.sms.poll,15000);
				}
			});
			
		}
	}
}


 