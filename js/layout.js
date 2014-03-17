

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
			
			// ———————————————————————————————————————————————————————————————————————————— build grid
			grid.init($_page, res);

			
			// ———————————————————————————————————————————————————————————————————————————— build folios and credits
			for (var p = 0; p < 2; p++) {
				var numero;
				var folio = $('<div class="slot folio" data-type="folio"></div>');
				$_page.append(folio);
				

				// position folios on the right page, through options passed to randomPosition
				var t = bordPerdu, r = w - bordPerdu, b = h - bordPerdu, l = bordPerdu;
				if (i==0 && p==0 || i == 1 && p ==0 || i == 2 && p == 0 || i == 3 && p ==0) r = w/2;
				if (i==0 && p==1 || i == 1 && p ==1 || i == 2 && p == 1 || i == 3 && p ==1) l = w/2;

				folio.attr('data-layout-limit-right', r);
				folio.attr('data-layout-limit-left', l);
				
				if(i==0 && p==0){
					numero = 8;
					var d = new Date();

					var _date = d.getDate() + '/' + parseInt(d.getMonth()) +1 + '/' + d.getFullYear() ;
					var creditsText = '<p><img src="css/logo.png"><br><span>Maison des éditions</span> <br> <span>Les motifs du travail</span></p>';
					var credits = $('<div class="slot credits"  data-type="credits">' + creditsText + '<p>'+ _date +'</p><div id="credits"></div></div>');
					$_page.append(credits);
					layout.randomPosition(credits, {'top':t, 'right':r , 'bottom': b, 'left':l});
				} else {
					numero = i + 1 + (p == 0 ? i-1 : i) ;					
				}

				layout.randomPosition(folio, {'top':t, 'right':r , 'bottom': b, 'left':l});
				folio.text(numero);
				
			};
			


			// generate content slots
			for (var j = 1; j < slots_nb; j++) {
				var txt0rImg = Math.random();
				var s = new layout.Slot(builtSlots, txt0rImg >0.8 ? 'text' : 'photo');
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


		

		// multipageview
		grid.multipageCss();
		multipageMode = true;
	    page.setCurrentPage($pages[0]);
		page.switchToMultipageView();

		// --------------------------------------------------------------------------------------------- main content slot
		// analyser la source pour savoir comment la mettre en page
		// = longueur du texte ?


		// déterminer où positionner ce contenu primaire
		// crappy : grab extension
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
					maincontent.attr('data-type', 'text');
        			layout.updateCredits();
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


	updateCredits : function(){
		$('#credits').empty();
		$('.auteur').each(function(){
			$('#credits').append('<p class="auteur"><span>+ ' + $(this).html() + '</span></p>');     		
		});
    	
	},

	changeNumberOfSlots : function(moreOrLess){
		var slotsToMove = $currentPage.find('.slot:not(.folio):not(#slot0)');
		
		if (moreOrLess == 'less') {
			slotsToMove.last().remove();
			layout.updateCredits();
		} else {
			var txt0rImg = Math.random();
			var s = new layout.Slot(builtSlots, txt0rImg >0.8 ? 'text' : 'photo');
			$currentPage.append(s);
			layout.initPositionAndSize(s);
			layout.fillSlot(s);
			slots.push(s);
			builtSlots++;
			layout.updateCredits();
		};

		
	},

	

	// uses imagesList, available_images and available_images_nb which are declared in init.js and filled in source.js

	randomimage : function(){
		var randomnum = Math.floor(Math.random()*available_images_nb),
			randomimage = available_images[randomnum];

		return $(randomimage).text();
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
		        		// avoid duplicates
		        		if(usedsources.indexOf(html) === -1){
			        		layout.updateCredits();
			        		usedsources.push(html);
			        		slot.html(content);		
			        	}
					}						
				});
			break;
			case 'photo': 
				var src = layout.randomimage();
				// avoid duplicates
        		if(usedsources.indexOf(src) === -1){
			        	
					slot.html('<div class="img"><img src="_img/cache/grey/2000x2000/'+src+'"></div>');
					usedsources.push(src);
				}
				//return content;
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



	// unused
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
				focused = focused.parent().find('>div:not(.folio):first-of-type');
			}
		}
		
		focused.addClass("focused");	
	},



	// ------------------------------------------------------------------------------------------ absolute position and size
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
		//console.log(slotheight, slot, h - slotheight  + bordPerdu, h, slotheight, bordPerdu);

		var randColNb = Math.floor(Math.random()*colSlots.length);
			
		var _top = Math.floor(Math.random()*(h - slotheight  + bordPerdu));
		var _left = colSlots[randColNb].left;
		slot.attr('data-colslots-left', colSlots[randColNb].left);
		slot.css({'top':_top, 'left':_left});
	},

	// options (limits) = { top:0, right : 0, bottom: 0, left:0 }
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
		
		slot.css({'top':_top, 'left':_left});
	},

	randomColWidth : function(slot){
		var randColNb = Math.floor(Math.random()*colSlots.length);
		var _width = colSlots[randColNb].width;
		slot.attr({'data-width': _width});
		slot.css({'width':_width});
	},

	randomWidth : function(slot){
		
		var _width = Math.floor(Math.random()*(w/2))+ w/2;
		slot.attr({'data-width': _width});
		slot.css({'width':_width});
	},

	initPositionAndSize: function(slot, main){
		
		var proba = Math.random();

		// sometimes, return a big bitmapized image
		if (proba > 0.95 && slot.attr("data-type") == "photo"){
			layout.randomWidth(slot);
			layout.randomPosition(slot);
			layout.bmapize(slot);
			slot.removeClass('fullImage');
			slot.addClass('hugeImage');
			
		} // sometimes, return a full page image
		if (proba > 0.8 && slot.attr("data-type") == "photo"){
			// width + height
			var _width = Math.floor(Math.random()*(w/2))+ w/2;
			slot.attr({'data-width': _width});
			slot.css({
				'width': w/2 - bordPerdu *2,
				'height': h - bordPerdu *2,
				'left' : Math.random() > 0.5 ? bordPerdu : w/2 +bordPerdu,
				'top' : bordPerdu
			});
			
			layout.fullWidth(slot);
			slot.addClass('hugeImage fullImage');
			
		}

		// most of the time
		else if (slot.attr("data-type") == "photo"){
			slot.removeClass('hugeImage');
			slot.removeClass('fullImage');
			layout.normalize(slot);
			layout.randomColWidth(slot);
			layout.randomColPosition(slot);
		} else {
			layout.randomColWidth(slot);
			layout.randomColPosition(slot);
		}
	
	},

	normalize : function(slot){
		var t = setTimeout(function(){
			var width = w/2 - bordPerdu *2,
				height = h - bordPerdu *2,
				size = ~~width + 'x' + ~~height,
				$img = slot.find('img'),
				src = $img.attr('src').replace('full', 'grey').replace(size, '2000x2000').replace('trame1', 'grey');
			$img.attr('src', src);
			
		}, 400, slot)
		
	},
	bmapize : function(slot){
		var t = setTimeout(function(){
			var $img = slot.find('img'),
				src = slot.find('img').attr('src');
			$img.attr('src', src.replace('grey', 'trame1').replace('full', 'trame1'))
		}, 400, slot)
		
	},

	fullWidth : function(slot){
		var t = setTimeout(function(){
			var width = w/2 - bordPerdu *2,
				height = h - bordPerdu *2,
				size = ~~width + 'x' + ~~height,
				$img = slot.find('img'),
				src = $img.attr('src').replace('grey', 'full').replace('2000x2000', size);
			$img.attr('src', src);
			
		}, 400, slot)
		
	},

	reinitPositionAndSize : function(slot){
		var slotsToMove;
		if(multipageMode==false){
			slotsToMove = $currentPage.find('.slot:not(.folio)');
		} else {
			slotsToMove = slots;
		}
		for (var i = 0; i < slotsToMove.length; i++) {
			layout.movePosition($(slotsToMove[i]));
		};
		layout.initPositionAndSize(slot);
		//layout.randomColPosition(slot);
	}
}