<html>
<head>
	<title>Images sources</title>
</head>
<body>
<?php
	function listFolderFiles($dir){
	    $ffs = scandir($dir);
	    $dirclassname = str_replace('_img/uploads/', '', $dir);
	    echo '<div class="'.$dirclassname.'">';
	    foreach($ffs as $ff){
	        if($ff != '.' && $ff != '..'){
	            
	            if(is_dir($dir.'/'.$ff)) {
	            	
            		listFolderFiles($dir.'/'.$ff);
            	} else {
            		$file = $dir.'/'.$ff;
            		if (stripos($file, '.jpg') !== false || stripos($file, '.jpeg') !== false || stripos($file, '.png') !== false || stripos($file, '.gif') !== false) {
            			echo '<p>'.$file . '</p>';
            		}
            		
            	}
	            
	        }
	    }
	    echo '</div>';
	}

	listFolderFiles('uploads');

?>
</body>
</html>