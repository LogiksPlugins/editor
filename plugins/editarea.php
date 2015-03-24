<?php
echo "<script type='text/javascript' src='".$webPath."editarea/edit_area_full.js'></script>
	 <link rel='stylesheet' href='".$webPath."edit_area.css' type='text/css' media='all' />";
echo "<script language='javascript'>\n";
echo "var editor=null;";
echo "function loadEditArea(divID,ext) {
		editor=editAreaLoader.init({
				id: divID	// id of the textarea to transform		
				,start_highlight: true	// if start with highlight
				//,fullscreen: true
				,allow_resize: 'both' //'y'
				,allow_toggle: false
				,word_wrap: true
				,language: 'en'
				,syntax: ext //html
				,show_line_colors: true
				,toolbar: 'new_document, save, load, |, charmap, fullscreen, |, search, go_to_line, |, undo, redo, |, select_font, |, syntax_selection, |, change_smooth_selection, highlight, reset_highlight, |, help'
				,syntax_selection_allow: 'css,html,js,php,python,vb,xml,c,cpp,sql,basic,pas,brainfuck'
				//,is_multi_files: true
				
				,font_size: '8'
				,font_family: 'verdana, monospace'
				
				,plugins: 'charmap'
				,charmap_default: 'arrows'

				//,display: 'later'
				//,replace_tab_by_spaces: 4
				//,min_height: 350
				
				//,load_callback: 'my_load'
				//,save_callback: 'my_save'
				//,EA_load_callback: 'editAreaLoaded'
				//,EA_load_callback:'doResize'
			});	
		}";
echo "function loadEditor(divID) { loadEditArea(divID,'php'); }\n";
echo "function loadCodeEditor(divID,scriptType) { loadEditArea(divID,scriptType); }\n";
echo "function fixEditorSize(divID) {  }\n";
echo "</script>\n";
?>
