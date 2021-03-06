<html>
<head>
	<meta charset="utf-8">
	<title>Maison des éditions — in-quarto</title>
	<meta name="description" content="list sources">
</head>
<body>
	<div id="container">
	<?php

		require_once("utils/simple_html_dom.php");
		require_once("utils/rglob.php");

		function is_image($file) {
		    $size = getimagesize($file);
		    if(!$size) {
		        return 0;
		    }

		    $valid_types = array(IMAGETYPE_GIF, IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_BMP);

		    if(in_array($size[2],  $valid_types)) {
		        return 1;
		    } else {
		        return 0;
		    }
		}


	    $txt = rglob('*.html', './_txt');
	    $txt = glob('./_txt/*.html');
	    
	    $cam = glob('./_cam/*.png');

	    //$img = rglob('*.jpg', './_img/uploads/web');
	    $img = glob("{./_img/uploads/dessins/*.png,./_img/uploads/dessinsmarie/*.png,./_img/uploads/web/*.jpg}",GLOB_BRACE);
	    $papier = rglob('*.JPG', './_img/uploads/papier');
	    


	    shuffle($txt);
	    shuffle($cam);
	    shuffle($img);
	    shuffle($papier);

		$txt = array_slice($txt ,0 ,50);
		$cam = array_slice($cam ,0 ,20);
		$img = array_slice($img ,0 ,80);
		$papier = array_slice($papier ,0 ,20);

	 	$sources = array_merge ($txt,  $img, $papier);
		shuffle($sources);
		$sources = array_slice($sources, 0, 25);

		foreach ($sources as $file) {
			
			if (is_image($file)){ 
				$imagesourcedir = substr($file, 2, 4);
				$image = substr($file, 7);
				
				// CRAPPY
				if($imagesourcedir == '_cam'){
					$content = '<div class="img"><img src="' . $file . '" width="200"></div>';
				} else {
					$content = '<div class="img"><img src="_img/cache/grey/400x400/' . $image . '"></div>';	
				}
				
				
			} else {
				$html = file_get_html($file);
				$titre = $html->find('h1', 0)->innertext;
				if($titre == ''){ 
					$text = $html->plaintext;
					$dot = stripos ($text, '.'); //find first dot position
					$titre = substr($text, 0, $dot+1);
				}
				if (strlen($titre) < 50) {
					$content = "<h1 class='nord'>$titre</h1>";
				} else if (strlen($titre) > 150) {
					$content = "<p>$titre</p>";
				} else {
					$content = "<h1>$titre</h1>";
				}
				
			}
			echo '<div class="item" data-source="'. substr($file,2) .'">' . $content . '</div>';
		}
		

	?>
	</div>
</body>
</html>