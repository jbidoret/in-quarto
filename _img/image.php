<?php


    // allowed modes
    $modes = array('bitmap', 'hole', 'bg', 'grad', 'grey', 'intext', 'blue', 'bluue', 'wall', 'trame1', 'full');

    // debug
    if ($_GET["debug"]=="True") $debug=true;

    
    
    $sourcedir = 'uploads';
    $destination = "cache";
    /*
        cache/mode/widthxheight/dir/source.jpg
    */

    // params
    $params = explode('/', $_GET["params"]);

    // tests and variables assignation
    
    // empty vars
    $path = '';
    $file = '';
    $destdir = '';



    // mode
    if (in_array($params[1], $modes)) $mode = $params[1];
    else die($params[1] . ' is not a valid mode');

    // uid (to build unique destdir)
    

    $size = $params[2];
    $filepath = implode("/", array_slice($params, 3));
    
    $filedir = implode("/", array_slice($params, 3, -1));
    
    // browse dirs passed as params
    function random_pic($dirs) {
        if(sizeof($dirs)>0){
            
            $dirstring = "uploads/null/*.png";
            foreach ($dirs as $value) {
                $dirstring .= ",uploads/" . $value . "/*.jpg,uploads/" . $value . "/*.JPG,uploads/" . $value . "/*.png,uploads/" . $value . "/*.jpeg";               
            }
            $dirstring = '{' . $dirstring . '}';
            
            $img = glob($dirstring,GLOB_BRACE);  
        } else {
            $img = glob("{uploads/*/*.jpg,uploads/*/*.JPG,uploads/*/*.png,uploads/*/*.jpeg}",GLOB_BRACE);    
        }
        
        $faile = array_rand($img);
        
        return $img[$faile];
    }

    // random-dessins+submit+machin
    // ou bien 
    // random
    if (strpos($filedir, 'random') !== false) {
        
        if (strpos($filedir, '/') !== false) {
            $randomdirs = explode("/", $filedir);
            if(sizeof($randomdirs)>1){
                $dirs = explode(",", $randomdirs[1]);
            }
        } 
        $filepath = random_pic($dirs);    
    } 
    
    //$file = './' . htmlspecialchars(substr($filepath, 0, -4), ENT_QUOTES, 'UTF-8');
    $file = './' . htmlspecialchars($filepath, ENT_QUOTES, 'UTF-8');
    
    

    if (!file_exists($filepath)) {
        die('No image : ' . $filepath);
    } 
    $destdir = './cache/' . $mode . '/' . $size . '/' .  $filedir;

    
    

    init();

    function init(){

        global $debug, $params, $destdir;

        if($debug==true){
            // remove previously calculated files
            // exec ("rm -f " . $destdir . "/*");
        }
        // if $destdir does’nt exist, create it, then create image
        if (!is_dir($destdir)) {
            mkdir($destdir, 0777, true);
        }
        
        createImage($destdir);

    }


    function createImage($destdir){

        global $debug, $uid, $file, $mode, $size;

        // ------------------------------------------------------------------------------------------------ Init
        
        //  location of imagemagick's convert utility
        //$convert = '/usr/bin/convert';
        $convert = '/opt/ImageMagick/bin/convert';
        $identify = '/opt/ImageMagick/bin/identify';

        //exec($convert . " -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
        
        // image properties from file
        list($o_width, $o_height, $o_type, $o_attr) = getimagesize($file);
        

        // ------------------------------------------------------------------------------------------------ Caching
        // retrieve the file name (end)
        if($file != ''){
            $cache = end(split('/',$file));
        } else {
            $cache = $slug;
        }
        $cache = $destdir . '/' . $cache;

        // ------------------------------------------------------------------------------------------------ Caching
        $temp = escapeshellcmd($cache . '.tmp.png');
        $flare_tmp = escapeshellcmd($cache . '.flare.png');
    

        // image properties from file
        list($width, $height, $type) = getimagesize($file);
        

        $sizeArray = explode('x', $size);//round($size/$height * $width);
        $destwidth = $sizeArray[0];
        $destheight = $sizeArray[1];//round($size/$height * $height);

        $flare_src = './flare-w.png';

        function getpos($img, $width, $height){
            die($width);
            $pos = '+'. rand(20,$width-240) . '+' . rand(20,$height-240);
            return $pos;
        }
        function getrandscale(){
            $randsize = rand(12, 36) *10;
            return $randsize . 'x' . $randsize;   
        }

        function getrandGradient(){

            $colors = array(
                '60,186,60', // vert vif
                '53,157,217', // cyan
                '45,175,230', // cyan…
                '185,35,98', // vieux rose dense
                '219,75,105', // vieux rose clair
                '152,137,94', // « or »
                '255,0,255', // maxi pink
                '211,61,31', // vermillon
                '255,128,0', // orange
                '26,40,84', // bleu nuit
                '52,33,189'); // outremer RVB
            $color1 = $colors[rand(0, count($colors)-1)];
            //die(" 'rgb(" . $color1 . ")-rgb(" . $color2 . ")' ");
            return $color1;

            //return " '0,0     rgba(" . $color1 . ",1) 0,1000     rgba(" . $color2 . ",1)' ";   
        }


        // ------------------------------------------------------------------------------------------------ Switch
        switch ($mode) {
            case 'bitmap':
                exec ($convert . " " . $file . " -resize ". $destwidth ."x". $destheight ." -remap pattern:gray50 " . $temp);
                exec ($convert . " " . $file . " -fuzz 30% -transparent black png8:" . $cache);
                break;

            case 'grad':
                // random gradient on bitmap image
                //die($convert . " -size ". $size ."x1000 " . getrandGradient() . " ". $cache);
                exec ($convert . " -size ". $destwidth ."x". $destheight . " xc: -channel RGBA -sparse-color  Shepards  '". $destwidth/2 . ",0     rgba(" . getrandGradient() . ",1) ". $destwidth/2 . ",". $destheight . "     rgba(" .  getrandGradient() . ",1)'  ". $cache); 
                exec ($convert . " " . $file . " -resize ". $destwidth ."x". $destheight ." -remap pattern:gray50 " . $temp);
                exec ($convert . " " . $temp . " -colors 2 -dither FloydSteinberg  -fuzz 30% -transparent black png8:" . $temp);
                exec ($convert  . "  -geometry +0+0 " . $cache . " " . $temp . " -composite -compose Screen " . $cache);
                

                break;

            case 'bg':
                exec ($convert . " " . $file . " -resize ". $size ." -remap pattern:gray50 " . $temp);
                exec ($convert . " " . $temp . " -dither FloydSteinberg -colors 2 -depth 1  png8:" . $cache);
                break;

            // used
            case 'grey':
                exec ($convert . " " . $file . " -resize ". $size ." -colorspace Gray -quality 70 " . $cache);            
                break;

            // used
            case 'full':
                if($o_width<$destwidth){
                    $rescale = '';
                    //
                    exec ($convert . " " . $file . " -colorspace Gray -resize ". $size ." -gravity Center -crop ". $size ."+0+0 +repage  -fill black -colorize 10% +level-colors '#000000', -ordered-dither h8x8a  PNG8:" . $cache);        
                } else{
                    exec ($convert . " " . $file . " -colorspace Gray -resize ". $size ."^ -gravity Center -crop ". $size ."+0+0 +repage -quality 70 " . $cache);            
                }
                //exec ($convert . " " . $file . " -colorspace Gray -gravity Center  -resize ". $size ."^ -crop 32x32+0+0 +repage -quality 70 " . $cache);            
                break;

            // used
            case 'trame1':
                exec ($convert . " " . $file . " -resize 1000x1000\> -colorspace Gray -fill black -colorize 10% +level-colors '#000000', -ordered-dither h8x8a  -fuzz 30% -transparent white PNG8:" . $cache);            
                break;

            case 'wall':
                exec ($convert . " " . $file . " -colorspace Gray -resize " . $size . "x2000\> -normalize -level 0%,90% -ordered-dither o8x8,4 +level-colors '#d31600',  -colors 4 -depth 8  " . $cache);            
                        
                break;

            case 'hole':
                exec ($convert . " " . $file . " -colorspace Gray  -resize 1000x1000\> -normalize -level 00%,100% -dither FloydSteinberg -colors 2 -contrast-stretch 5% +level-colors '#6a0bc1', -quantize transparent -depth 8  " . $cache);
                exec ($convert  . "  -geometry " . getpos($cache) . " " . $cache . " " . $flare_src . " -alpha Set -compose Dst_In  -composite  " . $cache);
                break;
            
            case 'combi':
                //exec ($convert . " " . $flare_src . ": -transparent white " . $flare_tmp);
                //exec ($convert . " -size 220x220 -transparent white " . $flare_tmp);
                exec ($convert . " " . $flare_src . " -resize " . getrandscale() . "  -type truecolormatte " . $flare_tmp);         
                
                exec ($convert . " " . $file . " -colorspace Gray -resize 2000x435\> -quality 70 " . $cache);          
                exec ($convert . " " . $file . " -colorspace Gray  -resize 2000x435\> -normalize -level 00%,100% -dither FloydSteinberg -colors 2 -contrast-stretch 5% +level-colors '#6a0bc1', -quantize transparent -depth 8  " . $temp);
                exec ($convert  . "  -geometry " . getpos($cache, $width, $height) . " " . $temp . " " . $flare_tmp . " -alpha Set -compose Dst_In  -composite  " . $temp);
                exec ($convert  . "  -geometry +0+0 " . $cache . " " . $temp . " -composite  " . $cache);
                /**/
                break;

            case 'blue':
                // création du canvas
                exec ($convert . " -size ". $destwidth ."x". $destheight ." xc:'#111138' " . $cache); 
                // manipulation de l’image photo source
                exec ($convert . " " . $file . " -resize '". $destwidth ."x". $destheight ."^' -gravity Center -crop ". $destwidth ."x". $destheight ."+0+0 +repage -colorspace Gray -fill black -colorize 10% +level-colors '#000000', -ordered-dither h4x4a " . $temp);
                exec ($convert  . " -geometry +0+0 " . $cache . " " . $temp . " -composite  " . $cache);
                break;   

            case 'intext':
                // création du canvas
                exec ($convert . " -size ". $destwidth ."x". $destheight ." xc:'#111138' " . $cache); 
                // manipulation de l’image photo source
                exec ($convert . " " . $file . " -resize '". $destwidth ."x". $destheight ."^' -gravity Center -crop ". $destwidth ."x". $destheight ."+0+0 +repage -colorspace Gray -fill black -colorize 10% +level-colors '#000000', -ordered-dither h4x4a " . $temp);
                exec ($convert  . " -geometry +0+0 " . $cache . " " . $temp . " -composite  " . $cache);
                break;     

            case 'bluue':
                // création du canvas
                exec ($convert . " -size ". $destwidth ."x". $destheight ." xc:'#111138' " . $cache); 
                // manipulation de l’image photo source
                exec ($convert . " " . $file . " -resize '". $destwidth ."x". $destheight ."^' -gravity Center -crop ". $destwidth ."x". $destheight ."+0+0 +repage -colorspace Gray -fill black -colorize 10% " . $temp);
                exec ($convert  . " -geometry +0+0 " . $cache . " " . $temp . " -compose Multiply -composite  " . $cache);
                break;

            default:
                # code...
                break;
        }    


        

        // if there is still no image, die
        if (!file_exists($cache)) {
            die('ERROR: Image conversion failed.');
        } else {
            unlink($temp);
            exec('rm ' . $temp);
            serveImage($cache);
        }
    }


    

    function serveImage($cache){
        // get image data for use in http-headers
        
        $imginfo = getimagesize($cache);
        $content_length = filesize($cache);
        $last_modified = gmdate('D, d M Y H:i:s', filemtime($cache)) . ' GMT';

        // array of getimagesize() mime types
        $getimagesize_mime = array(1 => 'image/gif', 2 => 'image/jpeg', 3 => 'image/png', 4 => 'application/x-shockwave-flash', 5 => 'image/psd', 6 => 'image/bmp', 7 => 'image/tiff', 8 => 'image/tiff', 9 => 'image/jpeg', 13 => 'application/x-shockwave-flash', 14 => 'image/iff');

        // did the browser send an if-modified-since request?
        if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
            // parse header
            $if_modified_since = preg_replace('/;.*$/', '', $_SERVER['HTTP_IF_MODIFIED_SINCE']);

            if ($if_modified_since == $last_modified) {
                // the browser's cache is still up to date
                header("HTTP/1.0 304 Not Modified");
                header("Cache-Control: max-age=86400, must-revalidate");
                exit ;
            }
        }

        // send other headers
        header('Cache-Control: max-age=86400, must-revalidate');
        header('Content-Length: ' . $content_length);
        header('Last-Modified: ' . $last_modified);
        if (isset($getimagesize_mime[$imginfo[2]])) {
            header('Content-Type: ' . $getimagesize_mime[$imginfo[2]]);
        } else {
            // send generic header
            header('Content-Type: application/octet-stream');
        }

        // and finally, send the image
        readfile($cache);
    }


?>