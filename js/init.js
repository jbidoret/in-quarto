

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

	avoidDoubleKey = false,
	
	slots_nb = 5, // default number of slots per page
	slots = [],
	builtSlots = 1,
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


function randRange(data) {
   var newTime = data[Math.floor(data.length * Math.random())];
   return newTime;	
}

function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function bordelize(func) {
   	var timeArray = new Array(2000, 3000, 6000, 30000, 45000);

   	// choose a random slots number among all slots and move them
   	var randslots = slots;
   	Shuffle(randslots);
   	if (document.mode == 'layout') {
   		var max = Math.floor(Math.random()*4);
   		var t = [];
   		for (var i = 0; i < max; i++) {
   			var myslot = slots[i];
   			t[i] = setTimeout(function(myslot){
   				layout.initPositionAndSize(myslot);
   			}, i*200, myslot)
   		};     		
	};
	clearInterval(bordelTimer);
	bordelTimer = setInterval(bordelize, randRange(timeArray));
}

var bordelTimer = setInterval(bordelize, 1000);


// ———————————————————————————————————————————————————————————————————————————— keyboard
/*

print  	|   	cam  	relayout	noise	more	less	|	select  	next
dwn   	| 		up  	g 			f 		d 	 	s		|	q			z


*/
$(document).keydown(function(e){ 
	if (!avoidDoubleKey){

		switch(e.keyCode){
			// save : down arrow
			case 40 :
				switch (document.mode){
					case 'layout' :
						saveAndPrint();
						break;
					}
				break;

			// webcam / take pic : up arrow
			case 38 :
				if (document.mode != "print") {
					if(document.mode != 'webcam' ) webcam.init();	
					else webcam.takepicture();				
				};
				break;


			// relayout : g
			case 71 :
				layout.reinitPositionAndSize(focused);
				break;

			// select source / multi page view : q
			case 81 :
				switch (document.mode){
					case 'layout' :
						page.switchToMultipageView();
						break;
					case 'init' :
						source.setCurrent()
						break;
				}			
				break;
			// next source / next page : z
			case 90 :
				switch (document.mode){
					case 'layout' :
						page.nextPage();
						break;
					case 'init' :
						source.change();
						break;
				}	
				break;
			
			// ———————————————————————————————————————————————————————————————— unused live @ b
			// move position : d
			case 68 :
				layout.movePosition(focused);				
			break;
			
			case 78 :
				menu.toggle(document.mode);
			break;
			
			// change focus 
			case 65:
				if(document.mode == 'layout' ){
					//layout.changeFocus();
					page.nextPage();
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
			
		}


		avoidDoubleKey = true;
		var dK = setTimeout(function(){
			avoidDoubleKey = false;
		},200)

		return false;
	}
	
});
