

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// source
// build main sources list
// bubbles sourceFocusedSrc to layout engine



var source = {

	select : function(){

		var $list = '<div id="list"></div>';
		$body.append($list);
		var href = ("list.php");
		$('#list').load(href + " #container", function() {

	    	var container = document.querySelector('#container');

	    	imagesLoaded( container, function() {
	    		$body.addClass('packed');
				var pckry = new Packery( container, { itemSelector: '.item', gutter: 20 });
				sourceFocused = $('#list .item:first-child');
				sourceFocusedSrc = sourceFocused.attr('data-source');
		
				sourceFocused.addClass('focused');
			});			
	    });
	},


	change : function(source){
		$sources = $('.item', $('#list'));

		$sources.each(function(){
			$(this).removeClass("focused");
		})
			
		if(source !== undefined){
			sourceFocused = source;
		} else {
			if(sourceFocused.next().length && sourceFocused.next().is('div')){		
				sourceFocused = sourceFocused.next();
			} else {
				sourceFocused = sourceFocused.parent().find('>div:first-of-type');
			}
		}

		sourceFocusedSrc = sourceFocused.attr('data-source');
		
		sourceFocused.addClass("focused");	
	},


	setCurrent : function(){

		switch(document.mode){
			case 'init':
				$('#list').remove();
				layout.init();
				longpoll.sms.poll();
				break;
			case 'layout' :
				$book.empty();
				selectSource();

		}
		

	}
}