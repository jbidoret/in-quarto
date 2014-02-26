

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// layout engine

var layout = {

	init : function(){

		document.mode = 'layout';

		// Creation of 4 pages
		for (var i = 0; i < pages_nb; i++) {

			var $_page = $('<div class="page" id="page' + i +'" data-folio="' + parseInt(i+1) + '"></div>');
			$book.append($_page);
			
			// build grid
			grid.init($_page, res);	

			// generate content slots
			for (var j = 0; j < slots_nb; j++) {
				var s = new layout.Slot(builtSlots);
				$_page.append(s);
				if(i==0 && j==0) focused = s;
				layout.initPositionAndSize(s);
				layout.fillSlot(s);
				slots.push(s);
				builtSlots++;
			};
			// hi-res page
			$_page.css({
				'width':w,
				'height':h
			})		
			$pages.push($_page);
		};

		var multipageCols = 2,
	        _w = w/10,
	        _h = h/10,
	        startx = 20,
	        starty = 20,
	        padx = 20,
	        pady = 20,
	        multipageStyle = '';

	    for (var i = 0; i < pages_nb; i++) {
	    	var l = startx + (i % multipageCols) * (padx + _w);
	        var t = starty + Math.floor(i / multipageCols) * (pady + _h);
	        multipageStyle += '.multipage #page' + i + '{left:'+ l + 'px; top:'+ t + 'px} '	
	    }
	    var $multipageCss = $('<style id="multipageCss" type="text/css">' + multipageStyle + '</style>');
	    $("head").append($multipageCss);
		
	    page.switchToMultipageView();
		page.setCurrentPage($pages[0]);
	},

	fillSlot : function(slot){
	
		var type = slot.attr('data-type');
		var content;
		switch(type){
			case 'text':
				$.ajax({
					url:'_txt/randtext.php?' + Math.random(), 
					success:function(data){
						var $dom = $(document.createElement("html"));
		        		$dom[0].innerHTML = data; 
		        		html = $dom.find('body').html();
		        		content="<div>" + html + "</div>";		
		        		slot.html(content);		
					}						
				});
			break;
			case 'photo': 
				var saltSrc = '_img/blue/1-2/400/random/tumblr_mcepy8g5Ox1ru82ue.jpg.png?' + Math.random();
				slot.html('<div class="img" style="background-image:url('+saltSrc+')" ><img src="'+saltSrc+'"></div>');
				//slot.html('<div class="img"><img src="'+saltSrc+'"></div>');
				return content;
			break;
			case 'drawing':
				content = "dessin";
				return content;
			break;
			case 'title':
				content = "<h1>titre</h1>";
				return content;
			break;
		} 
		
	},

	Slot : function(i, stype){

		var st = stype || sourcesTypes[Math.floor(Math.random()*sourcesTypes.length)]

		slot = $('<div class="slot" id="slot' + i + '" data-type="' + st + '">');
		return slot;
		
	},


	changeFocus : function(slot){
		for (var i = 0; i < slots.length; i++) {
			slots[i].removeClass("focused");
		}
		if(slot !== undefined){
			focused = slot;
		} else {
			if(focused.next().length && focused.next().is('div')){		
				focused = focused.next();
			} else {
				focused = focused.parent().find('>div:first-of-type');
			}
		}
		
		focused.addClass("focused");	
	},



	// ------------------------------------------------------------------------------------------ position and size
	movePosition : function(slot){
		
		var randColNb = Math.floor(Math.random()*colSlots.length);
			
		var _top = Math.floor(Math.random()*h);
		var _left = colSlots[randColNb].left;

		layout.randomSize(slot);

		slot.css({ 'top':_top, 'left':_left });
		if(_top >h + bordPerdu || _left > w+ bordPerdu){
			layout.randomPosition(slot);
		}
	},

	randomPosition: function(slot){
		
		var randColNb = Math.floor(Math.random()*colSlots.length);
			
		var _top = Math.random()*(h  + bordPerdu) - bordPerdu;
		var _left = colSlots[randColNb].left;
		
		
		slot.css({'top':_top, 'left':_left});
	},

	randomSize : function(slot){
		var randColNb = Math.floor(Math.random()*colSlots.length);
		var _width = colSlots[randColNb].width;
		slot.css({'width':_width});
	},

	initPositionAndSize: function(slot){
		layout.randomSize(slot);
		layout.randomPosition(slot);
	},


	reinitPositionAndSize : function(slot){
		var slotsToMove;
		if(multipageMode==false){
			slotsToMove = $currentPage.find('.slot');
		} else {
			slotsToMove = slots;
		}
		for (var i = 0; i < slotsToMove.length; i++) {
			layout.movePosition($(slotsToMove[i]));
		};
		layout.randomSize(slot);
		layout.randomPosition(slot);
	},
	changeFocus : function(slot){
		for (var i = 0; i < slots.length; i++) {
			slots[i].removeClass("focused");
		}
		if(slot !== undefined){
			focused = slot;
		} else {
			if(focused.next().length && focused.next().is('div')){		
				focused = focused.next();
			} else {
				focused = focused.parent().find('>div:first-of-type');
			}
		}
		
		focused.addClass("focused");	
	}
}