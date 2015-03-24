<?php
if(!defined('ROOT')) exit('No direct script access allowed');
if(isset($js)) $js->display();
if(isset($css)) $css->display();

$path="";
$site="";
if(isset($_REQUEST['site'])) {
	$site=$_REQUEST['site'];
} elseif(defined("SITENAME")) {
	$site=SITENAME;
} else {
	$site="";
}
if(isset($_REQUEST['path'])) {
	if(strlen($site)>0) {
		$path=APPS_FOLDER.$site."/".$_REQUEST['path']."/";
	}
	if(defined("APPS_MEDIA_FOLDER")) {
		$path.=APPS_MEDIA_FOLDER;
	} else {
		$path.="media/";
	}
	$path.=$_REQUEST['path']."/";
} else {
	if(strlen($site)>0) {
		$path=APPS_FOLDER.$site."/";
	}
	if(defined("APPS_MEDIA_FOLDER")) {
		$path.=APPS_MEDIA_FOLDER;
	} else {
		$path.="media/";
	}
}
$_SESSION["LGKS_EDITOR_FPATH"]=$path;

if(!function_exists("loadEditor")) {
	function loadEditor($editor) {
		$webPath=getWebPath(__FILE__);
		$rootPath=getRootPath(__FILE__);
		
		$editPlugin=$rootPath."plugins/".$editor.".php";
		if(file_exists($editPlugin)) {
			include $editPlugin;
		} else {
			if(MASTER_DEBUG_MODE=='true')
				trigger_error("Editor Plugin Not Found;");
		}
	}
}
if(!function_exists("listEditors")) {
	function listEditors() {
		$arr=scandir(dirname(__FILE__)."/plugins/");
		unset($arr[0]);
		unset($arr[1]);
		foreach($arr as $a=>$b) {
			$b=str_replace(".php","",$b);
			if(!file_exists(dirname(__FILE__)."/$b/")) {
				unset($arr[$a]);
			} else {
				$arr[$a]=$b;
			}
		}
		return $arr;
	}
}
?>
