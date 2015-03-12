<?php

if ( !empty( $_FILES ) ) {

    // $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    // $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

    // move_uploaded_file( $tempPath, $uploadPath );
	$target_dir = "data\\";
	$target_file = $target_dir . basename($_FILES['file']['name']);

	$FileType = pathinfo($target_file,PATHINFO_EXTENSION);
	// Check file size
	if ($_FILES['file']['tmp_name'] > 500000) {
	    echo "Sorry, your file is too large.";
	}
	// Allow certain file formats
	if($FileType != "json") {
	    echo "Sorry, only JSON files are allowed.";
	}
	$fileContent;

	if ($_FILES['file']['error'] == UPLOAD_ERR_OK               //checks for errors
	      && is_uploaded_file($_FILES['file']['tmp_name'])) { //checks that file is uploaded
	  $fileContent = file_get_contents($_FILES['file']['tmp_name']); 
	}

    $answer = array( 'answer' => $fileContent);
    $json = json_encode( $answer );

    echo $json;

} else {

    echo 'No files';

}

?>