

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// source
// build main sources list
// bubbles sourceFocusedSrc to layout engine



var source = {

	init : function(){

		// append a div to body which will contain images sources from random dirs
		$('body').append($imagesList);

		$.ajax({
			// load dirs
			url:'_img/sources.php?', 
			success:function(data){
				var $dom = $(document.createElement("html"));
        		$dom[0].innerHTML = data; 
        		var imageDirs = $dom.find('body > div > div');

        		imageDirs.each(function(){
        			imageDirsList.push($(this));
        		});
        		// randomize nb of active sources dirs
        		Shuffle(imageDirsList);
        		howManyDirs = Math.floor(Math.random() * 3)+1;
        		selectedImageDirs = imageDirsList.slice(0, howManyDirs);

        		for (var i = 0; i < selectedImageDirs.length; i++) {
        			$imagesList.append(selectedImageDirs[i][0].outerHTML)        			
        		};	
        		available_images = $imagesList.find('p').toArray();
				available_images_nb = available_images.length;
			}						
		});

		source.select();
	},

	select : function(){

		var $list = '<div id="list"></div>';
		$body.append($list);
		
		$('#list').load("list.php #container", function() {

	    	var container = document.querySelector('#container');

	    	for (var i = 0; i < Math.floor($body.width()/220); i++) {
	    		$stamp = $('<p class="stamp"></p>');
	    		$('#container').prepend($stamp);
	    	};
	    	
	    	$('.stamp').each(function(i){
	    		var height = Math.floor(Math.random()*80 + 10);
	    		$(this).css({
	    			'height': height,
	    			'position':'absolute',
	    			'width' : '220px',
	    			'left': 220 * i + 'px'

	    		});
	    	});

	    	$('.item').each(function(){
	    		if(Math.random() > 0.8) {
	    			$(this).addClass('w2');
	    		};
	    	});

	    	imagesLoaded( container, function() {
	    		$body.addClass('packed');
				var pckry = new Packery( container, {
					"itemSelector": '.item', 
					"stamp": ".stamp",
					"gutter": 20,
					"columnWidth": 200
				});
				sourceFocused = $('#list .item').first();
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