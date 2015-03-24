<script type='text/javascript' src='<?=$webPath?>ckeditor/ckeditor.js'></script>
<script type='text/javascript' src='<?=$webPath?>ckconfig.js'></script>
<script language='javascript'>
//CKEDITOR.config.language = 'fr';
//CKEDITOR.config.uiColor = '#AADC6E';
CKEDITOR.config.basePath= '<?=SiteLocation?>';
CKEDITOR.config.toolbar = 'Full';
CKEDITOR.config.height=200;
CKEDITOR.config.filebrowserBrowseUrl='plugins/modules/fileselectors/index.php?popup=direct&site=<?=SITENAME?>';
CKEDITOR.config.filebrowserImageBrowseUrl='plugins/modules/fileselectors/index.php?popup=direct&type=Images&site=<?=SITENAME?>';
CKEDITOR.config.filebrowserFlashBrowseUrl='plugins/modules/fileselectors/index.php?popup=direct&type=Flash&site=<?=SITENAME?>';
CKEDITOR.config.filebrowserUploadUrl='plugins/modules/fileselectors/index.php?popup=direct&command=QuickUpload&type=Files&site=<?=SITENAME?>';
CKEDITOR.config.filebrowserImageUploadUrl='plugins/modules/fileselectors/index.php?popup=direct&command=QuickUpload&type=Images&site=<?=SITENAME?>';
CKEDITOR.config.filebrowserFlashUploadUrl='plugins/modules/fileselectors/index.php?popup=direct&command=QuickUpload&type=Flash&site=<?=SITENAME?>';

CKEDITOR.config.protectedSource.push(/<\?[\s\S]*?\?>/g); // PHP Code
CKEDITOR.config.protectedSource.push(/<code>[\s\S]*?<\/code>/gi); // Code tags
CKEDITOR.config.protectedSource.push(/<tex[\s\S]*?\/tex>/g); // HTML tags

CKEDITOR.config.enterMode=CKEDITOR.ENTER_BR;
CKEDITOR.config.shiftEnterMode=CKEDITOR.ENTER_P;

//CKEDITOR.config.readOnly
CKEDITOR.config.fullPage=false;
CKEDITOR.config.skin='kama';

function loadCKEditor(divID) {
		if(!CKEDITOR.env.isCompatible) {
				showCompatibilityMsg();
				return false;
		}
		if($('#'+divID).width()<=100) 
			w=$('#'+divID).width()+'%';
		else
			w=$('#'+divID).width()+'px';
		editor=CKEDITOR.replace(divID, { width:w,height:$('#'+divID).height()});
}
function loadEditor(divID) { loadCKEditor(divID); }
function fixEditorSize(divID) {}
function showCompatibilityMsg() {
		var env = CKEDITOR.env;

		var html = '<p><strong>Your browser is not compatible with CKEditor.</strong>';

		var browsers =
		{
			gecko : 'Firefox 2.0',
			ie : 'Internet Explorer 6.0',
			opera : 'Opera 9.5',
			webkit : 'Safari 3.0'
		};

		var alsoBrowsers = '';

		for ( var key in env )
		{
			if ( browsers[ key ] )
			{
				if ( env[key] )
					html += ' CKEditor is compatible with ' + browsers[ key ] + ' or higher.';
				else
					alsoBrowsers += browsers[ key ] + '+, ';
			}
		}

		alsoBrowsers = alsoBrowsers.replace( /\+,([^,]+), $/, '+ and $1' );

		html += ' It is also compatible with ' + alsoBrowsers + '.';

		html += '</p><p>With non compatible browsers, you should still be able to see and edit the contents (HTML) in a plain text field.</p>';

		var alertsEl = document.getElementById( 'alerts' );
		alertsEl && ( alertsEl.innerHTML = html );
	};
</script>
<style>
.ajaxloadingckedit {
	background: url(../../../../misc/themes/default/images/ajax/loading.gif) no-repeat center center;
}
</style>
