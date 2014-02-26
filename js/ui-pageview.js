

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// switch between multi page / single page
// activate chosen page

var multipageMode = false,
	$currentPage;

var page = {
	

	switchToMultipageView : function(){
		
		if(multipageMode == false){
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
		
	}

} 