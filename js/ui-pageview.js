

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// switch between multi page / single page
// activate chosen page

var multipageMode = false,
	$currentPage;

var page = {
	

	switchToMultipageView : function(multipage){
		
		var _multipageMode = multipage ? multipage : multipageMode;
		if(_multipageMode == false){
			for (var i = 0; i < pages_nb; i++) {
		    	$pages[i].show()
		    }
			$('body').addClass('multipage');
			$('body').removeClass('onepage');
			multipageMode = true;
		} else{
			for (var i = 0; i < pages_nb; i++) {
		    	$pages[i].hide()
		    }
			
			$currentPage.show();
			$('body').removeClass('multipage');
			$('body').addClass('onepage');
			multipageMode = false;
		}

	},
	multipageCss :function(){
		var multipageCols = 2,
	        _w = w/5,
	        _h = h/5,
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

	},
	
	setCurrentPage : function(page){
		
		if(page !== undefined){
			_page = $(page);		
		} else {
			if($currentPage.next().length){		
				_page = $currentPage.next();
			} else {
				_page = $pages[0];
			}
		}
		for (var i = 0; i < pages_nb; i++) {
			$pages[i].removeClass("currentpage");
		}
		_page.addClass('currentpage');
		$currentPage = _page;
		
		layout.changeFocus(_page.find('>div:first-of-type'));
		
	},

	nextPage : function(page){
		
		if(page !== undefined){
			_page = $(page);		
		} else {
			if($currentPage.next().length){		
				_page = $currentPage.next();
			} else {
				_page = $pages[0];
			}
		}
		for (var i = 0; i < pages_nb; i++) {
			$pages[i].removeClass("currentpage");
			$pages[i].hide()
		}
			
		_page.addClass('currentpage');
		$currentPage = _page;
		$currentPage.show();
		
		layout.changeFocus(_page.find('>div:first-of-type'));
		
	}

} 