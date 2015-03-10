<?php
$lang_dir = __DIR__ . '/../views/langs';
$tpl_dir = __DIR__ . '/../views';

function loopdir( $dir , $callback = null ) {
    $dirres = opendir( $dir );
    if( !$dirres ) return;
    //列出 images 目录中的文件
    while (($file = readdir($dirres)) !== false){
        $path = $dir . '/' . $file;
        if( $file != '.' && $file != '..' ){
            if( is_dir( $path ) ){
                loopdir( $path , $callback );
            } else {
                $callback ? $callback( $path ) : "";
            }
        }
    }
    closedir($dirres);
}

$keys = array();
loopdir( $tpl_dir, function( $file ) use ( &$keys ) {
	$con = file_get_contents( $file );
	preg_match_all('|_e\([\'"]([^)]+)[\'"]\)|', $con, $matches);

	if( $matches[1] ){
		$keys = array_merge( $keys, $matches[1] );
	}
} );
$keys = array_filter( array_unique( $keys ) );


loopdir( $lang_dir, function( $file ) use ( &$keys ) {
	$langs = require_once $file;
	foreach ($keys as $key) {
		if( !isset($langs[ $key ]) ){
			$langs[ $key ] = '';
		}
	}
	file_put_contents( $file , '<?php return ' . var_export($langs, true) . ';' );
} );
