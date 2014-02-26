<?php

	//$filename= dirname(__FILE__)."/data.txt";
	$filename= "sms.txt";
	 
	$lastmodif = isset( $_GET['timestamp'])? $_GET['timestamp']: 0 ;
	$currentmodif=filemtime($filename);
	 
	while ($currentmodif <= $lastmodif) {
		usleep(10000);
		clearstatcache();
		$currentmodif =filemtime($filename);
	}
	 
	$response = array();
	//$response['msg'] =Date("h:i:s")." ".file_get_contents($filename);
	$response['current_date'] =Date("h:i:s");
	$response['timestamp']= $currentmodif;

	$data = json_decode(file_get_contents($filename));
	
	foreach($data as $key => $value){
		$response[$key] = $value; 
	}	
	
	echo json_encode($response);
	 
?>