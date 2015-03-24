<script type='text/javascript' src='<?=$webPath?>cleditor/jquery.cleditor.min.js'></script>
<link rel='stylesheet' href='<?=$webPath?>cleditor/jquery.cleditor.css'>
<script language='javascript'>
var editor=null;
function loadEditor(divID) { loadCLEditorEditor(divID); }
function loadCLEditorEditor(divID) {
	$(divID).cleditor({
			width: '100%',
            height: '99%'
		});
}
</script>
