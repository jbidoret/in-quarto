<?php
	
	$convert = '/opt/ImageMagick/bin/convert';
	
	for ($i=0; $i < 6; $i++) { 
		exec ($convert . " -size 820x820  plasma:fractal tmp/generation/fractal.png");
		exec ($convert . " tmp/generation/fractal.png -blur 0x12 -normalize \( -size 1x9 xc: -draw 'color 0,4 point' \) -fx 'v.p{0,G*(v.h-1)}' -threshold  50%  tmp/generation/fractal-0" . $i . ".png");
	}
	/*
	convert -size 820x820  plasma:fractal fractal.png


convert fractal.png  -blur 0x2  -edge 10 -fx G -shave 20x20 +repage -auto-level fractal-ok.png
convert fractal.png  -blur 0x12 -normalize -size 1x19   pattern:gray50   -fx 'v.p{0,G*(v.h-1)}' -contrast-stretch 15% fractal-ok.png

convert -size 820x820  plasma:fractal fractal.png
convert fractal.png -blur 0x12 -normalize \
     \( -size 1x9 xc: -draw 'color 0,4 point' -negate \) \
     -fx 'v.p{0,G*(v.h-1)}' -contrast-stretch 75% fractal-ok-08.png

convert -size 120x120  +noise Random fractal.png
  convert fractal.png   {..transform..} -virtual-pixel tile  -auto_level  fractal-ok.png
	*/
?>