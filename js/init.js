

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// init



// constants
// ————————————————————————————————————————————————————————————————————————————
var pages_nb = 4, // in-quarto
	$pages = [],

	res = 4, // display demultiplier : scale pages to multipage display
	h = 565 * res, 
	w = 800 * res,
	bordPerdu = 20 * res,
	
	slots_nb = 5, // default number of slots per page
	slots = [],
	builtSlots = 0,
	colSlots, // layout
	sourcesTypes = ['text', 'photo', 'drawing', 'title'],
	
	focused, // initial slot focused

	sourceFocused, //initial source focused
	sourceFocusedSrc, // + src
	
	// initial DOM elements
	$body = $('body'),
	$book = $('#book'),
	$popup = $('#popup'),
	$message = $('#message'),
	$video = $('#video'),
	$canvas = $('#canvas');
	
	// initial mode
	document.mode = 'init';



// ———————————————————————————————————————————————————————————————————————————— init
$(function(){
	source.select();	
});



// ———————————————————————————————————————————————————————————————————————————— keyboard
$(document).keydown(function(e){ 
	switch(e.keyCode){
		// change focus : a
		case 65:
			if(document.mode == 'layout' ){
				layout.changeFocus();
			} else if (document.mode == 'init' ){
				source.change();
			} else {
				// pass
			}
			
		break;
		// toggle grid : h
		case 72:
			grid.toggle();
		break;
		// change source : q
		case 81 :
			layout.fillSlot(focused);
		break;
		// random position : s
		case 83 :
			layout.reinitPositionAndSize(focused);
		break;
		// move position : d
		case 68 :
			layout.movePosition(focused);				
		break;
		// save : p
		case 80 :
			saveAndPrint();
		break;
		// switch view page / multipage : l
		case 76 :
			switch (document.mode){
				case 'layout' :
					page.switchToMultipageView();
				break;
				case 'init' :
					source.setCurrent()
				break;
			}			
		break;
		// m
		case 77 :
			switch (document.mode){
				case 'layout' :
					page.setCurrentPage();
				break;
				case 'init' :
					source.change()
				break;
			}	
			
		break;
		case 78 :
			menu.toggle(document.mode);
		break;
		// r
		case 82 :
			if(document.mode != 'webcam' ){
				webcam.init();	
			} else {
				webcam.takepicture();
			}
			
		break;
		
	}
});
