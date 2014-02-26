

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// popup : video recording / printing message

var popup = {
	show : function(){
		$popup.removeClass('invisible');
	},
	hide : function(){
		$video.stop();
		$popup.addClass('invisible');
	},
	txt : function(content){
		popup.show();
		$popup.html(content);
	}
}