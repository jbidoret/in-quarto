<?php	
	


	// mdé - in-quarto
	// ————————————————————————————————————————————————————————————————————————————

	// save webcam capture to disk
	// process and filter pic
	// saved processed pic and delete original
	
	// vars from post
	$data = $_POST['data'];
	$filename = $_POST['filename'];

	//save data:png base64 encoded to disk

	$destdir = './_cam/';
	$filename = $destdir . 'cam-' . date('y-m-j-m-i-s') . '.png';
	$tempfilename = $filename . '-tmp.png';
	$destfilename = $filename . '-ok.png';

	file_put_contents($filename, base64_decode(substr($data, strpos($data, ",")+1)));		

	$convert = '/opt/ImageMagick/bin/convert';

	// $modes = ['bitmap', 'treshold', 'contrast', 'riso'];
	// $randMode = $modes[rand(0,2)];

	// bitmap fuzz
	// exec ($convert . " " . $filename . " -remap pattern:gray50 " . $tempfilename);
    // exec ($convert . " " . $tempfilename . " -fuzz 30% -transparent black png8:" . $filename);
    
    // treshold   
	// exec ($convert . " " . $filename . " -colorspace Gray -threshold 50% " . $filename);

	// high contrast
	exec ($convert . " " . $filename . " -colorspace Gray -normalize  " . $filename);

	//die(substr($data, strpos($data, ",")+1));

	// riso
	//exec ($convert . " " . $filename . " -colorspace Gray -fill black -colorize 10% +level-colors '#000000', -ordered-dither h4x4a " . $destfilename);
	
		// if there is still no image, die
    if (!file_exists($filename)) {
        die('ERROR: Image conversion failed.');
    } 
    
?>



