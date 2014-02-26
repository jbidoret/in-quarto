var menu = {
	toggle : function(panel){
		if($('body').hasClass('menu')){
			$('body').removeClass('menu');
			$('#menu div div').hide();	
		} else{
			$('body').addClass('menu');
			$("#"+panel).show();	
		}
		
	}

}

