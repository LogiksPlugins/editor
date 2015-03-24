<?php
echo "<script type='text/javascript' src='".$webPath."nicedit/nicEdit.js'></script>\n";
echo "<script language='javascript'>\n";
echo "var editor=null;";
echo "function loadNicEdit(divID) { editor = new nicEditor({fullPanel : true,iconsPath : '".$webPath."nicedit/nicEditorIcons.gif'}).panelInstance(divID); }";
echo "function loadEditor(divID) { loadNicEdit(divID); }\n";
echo "function fixEditorSize(divID) {  }\n";
echo "</script>\n";
echo "<style>.nicEdit-main {background:white;} </style>";
?>
