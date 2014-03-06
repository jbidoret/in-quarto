<html>
<head>
	<title>Random text</title>
</head>
<body>
	<?php

	    $files = glob('./*.html');
		$random_file = $files[array_rand($files)];
		include($random_file);

	?>

</body>
</html>