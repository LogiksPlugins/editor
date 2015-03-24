<?php
$editV="codemirror";
echo "<script type='text/javascript' src='{$webPath}{$editV}/js/codemirror.js'></script>
		<link rel='stylesheet' href='{$webPath}{$editV}/css/codemirror.css' type='text/css' media='all' />
		<link rel='stylesheet' href='{$webPath}{$editV}/theme/default.css'>

		<script type='text/javascript' src='{$webPath}{$editV}/mode/xml/xml.js'></script>
		<script type='text/javascript' src='{$webPath}{$editV}/mode/javascript/javascript.js'></script>
		<script type='text/javascript' src='{$webPath}{$editV}/mode/htmlmixed/htmlmixed.js'></script>
		<script type='text/javascript' src='{$webPath}{$editV}/mode/css/css.js'></script>
		<script type='text/javascript' src='{$webPath}{$editV}/mode/clike/clike.js'></script>
		<script type='text/javascript' src='{$webPath}{$editV}/mode/php/php.js'></script>";
?>
<script language='javascript'>
var editor=null;
function loadCodeMirror(divID,ext) {
	if(ext==null) ext="htmlmixed";
	editor = CodeMirror.fromTextArea(document.getElementById(divID), {
				mode: ext,
				lineNumbers: true,
				lineWrapping: false,
				tabMode: 'shift',
				enterMode: 'keep',
				matchBrackets: true,
				indentWithTabs: true,
				indentUnit: 8,
				height:$("#"+divID).height(),
				onCursorActivity: function() {
						hlLine = editor.setLineClass(editor.getCursor().line, 'activeline');
						editor.setLineClass(hlLine, null);
						editor.matchHighlight("CodeMirror-matchhighlight");
				}
	});
	//var hlLine = editor.setLineClass(0, 'activeline');
	$(".CodeMirror-scroll").css("height",$("#"+divID).height());
}
function fixEditorSize(divID) {
	$('#'+divID).parent().find('.CodeMirror').each(function() {
		$(this).find('.CodeMirror-scroll').css('height',$('#'+divID).height());
	});
}
function loadEditor(divID) { loadCodeMirror(divID,'php'); }
function loadCodeEditor(divID,scriptType) { loadCodeMirror(divID,scriptType); }

function setExtension(ext) {
	if(ext==null) ext="htmlmixed";

	if(ext=="javascript" || ext=="js") {
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
		}
	} else if(ext=="xml") {
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.xmlHints);
		}
	} else if(ext=="pig") {
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.pigHints);
		}
	} else if(ext=="php") {
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.phpHints);
		}
	} else if(ext=="css") {
		CodeMirror.commands.autocomplete = function(cm) {
			CodeMirror.simpleHint(cm, CodeMirror.cssHints);
		}
	} else {
		CodeMirror.commands.autocomplete = null;
	}
}
function setFoldFunc(ext) {
	if(ext==null) ext="htmlmixed";
	if(ext=="htmlmixed" || ext=="xml" || ext=="xmlpure") {
		foldFunc = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
	} else {
		foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
	}
}
</script>
