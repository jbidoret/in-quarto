<?php
	
	

	// mdé - in-quarto
	// ————————————————————————————————————————————————————————————————————————————

	// save layout to disk 
	// build spreads
	// build imposition pdf
	// print !


	// vars from post
	$pages_nb = $_POST['pages_nb'];
	$folio = $_POST['folio'] + 1;
	$data = $_POST['data'];
	$dirname = $_POST['dirname'];


	// first create destination dir
	$destdir = './_mix/' . $dirname . '/';

	if ($folio == 1) {
		if (!is_dir($destdir)) {
            mkdir($destdir, 0777, true);
        }
	}

	//save data:png base64 encoded to disk
	if ($folio <= $pages_nb) {
		$PNGfilename = 'spread-'. $folio . '.png';
		file_put_contents($destdir . $PNGfilename, base64_decode(substr($data, strpos($data, ",")+1)));		
	} 

	// if all pages processed
	if ($folio == 4) {
		
		// utilities path
		$convert = '/opt/ImageMagick/bin/convert';
        $identify = '/opt/ImageMagick/bin/identify';
        $montage = '/opt/ImageMagick/bin/montage';

        // save spreads pdf
        exec ($convert . " " . $destdir ."*.png " . $destdir . "spreads.pdf");
		
		// imposition…
        $files = preg_grep('/^([^.])/', scandir($destdir));
        $filesnb = count($files);
        $i = 0;
        $pages = array();

        foreach ($files as $file) {
			if (in_array($file, array(".",".."))) continue;
			$prefix = 'spread-';
        	$suffix = '.png';
        	$spread = $i+1;
        	$half1 = $destdir . $prefix . $spread . '-1' . $suffix;
        	$half2 = $destdir . $prefix . $spread . '-2' . $suffix;
        	$i++;

        	// cut spreads in pages (badly named)
        	exec ($convert . " " . $destdir . $file . " -gravity west -crop 50x100%+0+0 " . $half1);
        	exec ($convert . " " . $destdir . $file . " -gravity east -crop 50x100%+0+0 " . $half2);
			array_push($pages, $half1);
			array_push($pages, $half2);
		}

		// Imposition
		exec ($montage . " " .  $pages[0]. " " . $pages[1]. " -mode concatenate -tile x1 " . $destdir . "print1.png" );
		exec ($montage . " " .  $pages[2]. " " . $pages[7]. " -mode concatenate -tile x1 " . $destdir . "print2.png" );
		exec ($montage . " " .  $pages[6]. " " . $pages[3]. " -mode concatenate -tile x1 " . $destdir . "print3.png" );
		exec ($montage . " " .  $pages[4]. " " . $pages[5]. " -mode concatenate -tile x1 " . $destdir . "print4.png" );
		
		exec ($convert . " " . $destdir . "print1.png " . $destdir . "print2.png " . $destdir . "print3.png " . $destdir . "print4.png " . $destdir . 'print.pdf' );

        // PRINT IT !

        // http://www.computerhope.com/unix/ulp.htm
		// http://www.cups.org/documentation.php/options.html#OPTIONS
		//exec('lp -d "HP_LaserJet_P3010_Series"  -o fit-to-page -o sides=two-sided-short-edge -o media=A4 ' . $destdir . 'print.pdf' );

		// delete png files

		$tmpfiles = glob($destdir . '*.png');
		foreach ($tmpfiles as $file) {
			
			if(is_file($file)){
				unlink($file);
			}
		}

	} 

?>



