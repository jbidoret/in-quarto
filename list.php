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


	    $txt = glob('./_txt/*.html');
	    $cam = glob('./_cam/*.png');
	    $img = rglob('*.jpg', './_img/cache');

	    shuffle($txt);
	    shuffle($cam);
	    shuffle($img);

		$txt = array_slice($txt ,0 ,50);
		$cam = array_slice($cam ,0 ,20);
		$img = array_slice($img ,0 ,20);

	 	$sources = array_merge ($txt, $cam, $img);
		shuffle($sources);
		$sources = array_slice($sources, 0, 15);

		foreach ($sources as $file) {
			echo '<div class="item" data-source="'. substr($file,2) .'">';
			if (is_image($file)){ 
				echo '<img src="' . $file . '" width="200">';
			} else {
				$html = file_get_html($file);
				$titre = $html->find('h1', 0)->innertext;
				if($titre == ''){ 
					$titre = substr($html->plaintext, 0, 50);
				}
				echo "<h1>$titre</h1>";
			}
			echo '</div>';
		}
		

	?>
	</div>
</body>
</html>