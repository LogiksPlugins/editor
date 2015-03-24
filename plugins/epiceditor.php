<script type='text/javascript' src='<?=$webPath?>epiceditor/epiceditor.js'></script>
<script language='javascript'>
var editor=null;
function loadEditor(divID) { loadEpicEditor(divID); }
function loadEpicEditor(divID) {
	var element = document.getElementById(divID);
	editor = new EpicEditor(element);
	editor.options({
			basePath:"<?=str_replace(ROOT,"",dirname(dirname(__FILE__)))?>/epiceditor/resources",
			//focusOnLoad:true,
			file:{
				//name:'example',
				//defaultContent:'#Write text in here!'
			},
			themes:{
				editor:'/themes/editor/epic-logiks.css',
				preview:'/themes/preview/preview-default.css',
			},
		});
	editor.load();
}
function fixEditorSize(divID) {
	$("#"+divID).css("height","99%");
	$("#"+divID).css("width","99%");
	$("#"+divID).css("margin","auto");
}
</script>
<style>
</style>
