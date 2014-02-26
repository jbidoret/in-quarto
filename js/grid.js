

// mdé - in-quarto
// ————————————————————————————————————————————————————————————————————————————

// grid
// build grid, bleed zones and margins

var grid = {
	init : function(page, res){

		var marginTop=20*res,
			marginRight=20*res,
			marginBottom=20*res,
			marginLeft=20*res,
			gutterWidth=4*res,
			colNumber=5,
			colWidth;
			
		var zoneWidth = w/2 - marginLeft*2;
			
		// draw grid	
		var $pageZone = $('<section class="grid"></section>');
	
		//prepend to page
		page.append($pageZone);
		colWidth = (zoneWidth- gutterWidth*(colNumber-1)) / colNumber ;

		twoPagesWidth = zoneWidth*2 + marginLeft *2;
		$pageZone.css({
			'width':twoPagesWidth + gutterWidth*2 + 'px',
			'left': marginLeft + 'px',
			'top':marginTop + 'px',
			'height': h - marginBottom - marginTop + 'px'
		});
		// draw cols
		for (var i = 0 ; i < colNumber * 2; i++) {
			var $col = $('<span class="col">');
			if (i==colNumber-1) {
				var gwidth =  marginLeft*2;
			}else{
				var gwidth = gutterWidth;
			}
			$col.css({
				'width': colWidth, 
				'margin-right':gwidth,
				'height': h - marginBottom - marginTop + 'px'
			});
			$pageZone.append($col);
		};

			
		var twoColWidth = colWidth*2 + gutterWidth;
		var threeColWidth = colWidth*3 + gutterWidth*2;
		colSlots=[
			// first col
			{'left':marginLeft, 'width':twoColWidth},
			{'left':marginLeft, 'width':threeColWidth},

			// 2nd col
			{'left':marginLeft + colWidth + gutterWidth, 'width':twoColWidth},
			{'left':marginLeft + colWidth + gutterWidth, 'width':threeColWidth},

			// 3d col
			{'left':marginLeft + colWidth*2 + gutterWidth*2, 'width':twoColWidth},
			{'left':marginLeft + colWidth*2 + gutterWidth*2, 'width':threeColWidth},

			// 5th col
			{'left':marginLeft * 3 + colWidth * 5 + gutterWidth * 4, 'width':twoColWidth},
			{'left':marginLeft * 3 + colWidth * 5 + gutterWidth * 4, 'width':threeColWidth},

			// 6th col
			{'left':marginLeft * 3 + colWidth * 6 + gutterWidth * 5, 'width':twoColWidth},
			{'left':marginLeft * 3 + colWidth * 6 + gutterWidth * 5, 'width':threeColWidth},

			// 7th col
			{'left':marginLeft * 3 + colWidth * 7 + gutterWidth * 6, 'width':twoColWidth},
			{'left':marginLeft * 3 + colWidth * 7 + gutterWidth * 6, 'width':threeColWidth},
		]

		
	},

	toggle : function(){
		$('.grid').toggle();
	}
}

	
