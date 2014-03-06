

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// layout engine

var layout = {

	init : function(){

		document.mode = 'layout';

		// @TODO
		// établir sourceFocusedSrc comme source primaire
		// établir sa mise en page
		// avant de convoquer d’autres sources
		


		// analyser la source pour savoir comment la mettre en page
		// = longueur du texte ?



		
		

		// déterminer où positionner ce contenu primaire
		
		//css regions
		buildRegions = function($_page){
			var $regions = [];

			if(maincontent.html().length < 2000){
				maincontent.addClass('huge');
			} else if(maincontent.html().length < 4000){
				maincontent.addClass('big');
			}
			layout.initPositionAndSize(maincontent, true);
			for (var i = 0; i < 4; i++) {
				$regions[i] = $('<div class="slot region" data-type="text" id="slot' + parseInt(250 + i) + '"></div>')
				layout.initPositionAndSize($regions[i]);
				$_page.append($regions[i]);

			}

			//CSSRegions.doLayout()	        
		}
		
		
		

		// Creation of 4 pages
		for (var i = 0; i < pages_nb; i++) {

			var $_page = $('<div class="page" id="page' + i +'" data-folio="' + parseInt(i+1) + '"></div>');
			$book.append($_page);
			
			// ———————————————————————————————————————————————————————————————————————————— build grid
			grid.init($_page, res);

			
			// ———————————————————————————————————————————————————————————————————————————— build folios
			for (var p = 0; p < 2; p++) {
				var text;
				var folio = $('<div class="slot folio" data-type="folio"></div>');
				$_page.append(folio);
				
				var t = bordPerdu, r = w - bordPerdu, b = h - bordPerdu, l = bordPerdu;
				if (i==0 && p==0 || i == 1 && p ==0 || i == 2 && p == 0 || i == 3 && p ==0) r = w/2;
				if (i==0 && p==1 || i == 1 && p ==1 || i == 2 && p == 1 || i == 3 && p ==1) l = w/2;
				
				if(i==0 && p==0){
					text = 8;
				} else {
					text = i + 1 + (p == 0 ? i-1 : i) ;					
				}

				layout.randomPosition(folio, {'top':t, 'right':r , 'bottom': b, 'left':l});
				folio.text(text);
				
			};
			

			


			// buildRegions($_page);

			// generate content slots
			for (var j = 1; j < slots_nb; j++) {
				var txt0rImg = Math.random();
				var s = new layout.Slot(builtSlots, txt0rImg >.8 ? 'text' : 'photo');
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
		
		multipageMode = true;
	    
		page.setCurrentPage($pages[0]);
		page.switchToMultipageView();

		// main content slot
		var type = sourceFocusedSrc.slice(-3);
		
		if(type=="txt" || type=="tml"){
			var maincontent = new layout.Slot(0, 'text');
			builtSlots++;
			focused = maincontent;
			$.ajax({
				url:sourceFocusedSrc, 
				success:function(data){
					content="<div>" + data + "</div>";		
	        		maincontent.html(content);		
	        		maincontent.attr('data-type', 'text')	        		
				}						
			});
			layout.initPositionAndSize(maincontent, true);

		} else {
			var maincontent = new layout.Slot(0, 'text');
			builtSlots++;
			focused = maincontent;
			var saltSrc = sourceFocusedSrc.replace('_img', '_img/cache/grey/2000x2000');			
			maincontent.html('<div class="img"><img src="'+saltSrc+'"></div>');
			maincontent.attr('data-type', 'photo');
			layout.initPositionAndSize(maincontent, true);
		}
		$('#page0').append(maincontent);
	},


	// random slot filling
	fillSlot : function(slot, src){
		
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
				var saltSrc = '_img/cache/grey/2000x2000/random/image.png?' + Math.random();
				//slot.html('<div class="img" style="background-image:url('+saltSrc+')" ><img src="'+saltSrc+'"></div>');
				slot.html('<div class="img"><img src="'+saltSrc+'"></div>');
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


	paginate : function(page){
		


	},



	// ------------------------------------------------------------------------------------------ position and size
	movePosition : function(slot){
		
		var randColNb = Math.floor(Math.random()*colSlots.length);
			
		var _top = Math.floor(Math.random()*h);
		var _left = colSlots[randColNb].left;

		layout.randomColWidth(slot);

		slot.css({ 'top':_top, 'left':_left });
		if(_top >h + bordPerdu || _left > w+ bordPerdu){
			layout.randomColPosition(slot);
		}
	},

	randomColPosition: function(slot){
		
		var slotheight = slot.height();

		var randColNb = Math.floor(Math.random()*colSlots.length);
			
		var _top = Math.random()*(h - slotheight  + bordPerdu) - bordPerdu;
		var _left = colSlots[randColNb].left;
		
		
		slot.css({'top':_top, 'left':_left});
	},

	randomPosition: function(slot, options){
		
		if(options == undefined ){
			var top = bordPerdu, 
				right = w - bordPerdu, 
				bottom = h - bordPerdu, 
				left = bordPerdu;
		} else {
			
			var top = options.top, 
				right = options.right, 
				bottom = options.bottom, 
				left = options.left;
				
		}
			
		var _left = Math.random()*(right-left) + left;
		var _top = Math.random()* (bottom - top) + top;
		
		console.log(options, top, right, bottom, left, '/', _top, _left)
		slot.css({'top':_top, 'left':_left});
	},

	randomColWidth : function(slot){
		var randColNb = Math.floor(Math.random()*colSlots.length);
		var _width = colSlots[randColNb].width;
		slot.css({'width':_width});
	},

	initPositionAndSize: function(slot, main){
		layout.randomColWidth(slot);
		layout.randomColPosition(slot);
		if (main==true) {
			console.log('main' , main)
			var height = h - parseInt(slot.css('top')) - bordPerdu;
			slot.css({'height': height});
		};
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
		layout.randomColWidth(slot);
		layout.randomColPosition(slot);
	}
}