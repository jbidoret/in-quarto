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
		