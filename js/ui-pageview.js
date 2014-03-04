

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