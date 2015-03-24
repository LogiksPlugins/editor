<?php
echo "<script type='text/javascript' src='".$webPath."markitup/jquery.markitup.js'></script> 
	<script type='text/javascript' src='".$webPath."markitup/sets/default/set.js'></script> 
	<link rel='stylesheet' type='text/css' href='".$webPath."markitup/skins/markitup/style.css' /> 
	<link rel='stylesheet' type='text/css' href='".$webPath."markitup/sets/default/style.css' /> \n";
echo "<script language='javascript'>\n";
echo "var editor=null;";
echo "function loadMarkitup(divID) {
			// $('textarea').markItUp( { Settings }, { OptionalExtraSettings } );
			editor=$('#'+divID).markItUp(defaultSettings, {
					//previewInWindow:'width=800, height=600, resizable=yes, scrollbars=yes',
				});
			//$('#markItUp'+divID+'.markItUp').css('width',$('#'+divID).width());
			
			/*
			// You can add content from anywhere in your page
			// $.markItUp( { Settings } );	
			$('.add').click(function() {
				$.markItUp( { 	openWith:'<opening tag>',
								closeWith:'<\/closing tag>',
								placeHolder:'New content'
							}
						);
				return false;
			});
			
			// And you can add/remove markItUp! whenever you want
			// $(textarea).markItUpRemove();
			$('.toggle').click(function() {
				if ($('#markItUp.markItUpEditor').length === 1) {
					$('#markItUp').markItUpRemove();
					$('span', this).text('get markItUp! back');
				} else {
					$('#markItUp').markItUp(mySettings);
					$('span', this).text('remove markItUp!');
				}
				return false;
			});*/
		}";
echo "function loadEditor(divID) { loadMarkitup(divID); }\n";
echo "function fixEditorSize(divID) {  }\n";
echo "</script>\n";
?>
