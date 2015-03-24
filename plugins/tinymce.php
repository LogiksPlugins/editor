<?php
echo "<script type='text/javascript' src='".$webPath."tinymce/tiny_mce.js'></script>
	<script type='text/javascript' src='".$webPath."tinymce/jquery.tinymce.js'></script>
	<script type='text/javascript' src='".$webPath."tinyconfig.js'></script>\n";
	
echo "<script language='javascript'>\n";
echo "function loadTinyMCE(divID) { tinySettings['elements']=divID; tinySettings['skin']='o2k7'; tinySettings['template_templates']=template_templates;  tinyMCE.init(tinySettings); }\n";
echo "function loadEditor(divID) { loadTinyMCE(divID); }\n";
echo "function fixEditorSize(divID) {  }\n";
echo "</script>\n";
?>
