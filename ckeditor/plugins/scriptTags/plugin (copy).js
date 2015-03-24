/*
	Plugin To Embed and view Scripts (PHP,JS, etc...)
	version 0.4 01/08/2012

	Author : Bismay Kumar Mohapatra
*/
CKEDITOR.plugins.add('scriptTags', {
	requires: [ 'iframedialog' ],
	init: function( editor ) {
		editor.ui.addButton( 'scriptTags',	{
				label : editor.toolbar,//'mediakit'
				command : 'scriptTags',
				icon : this.path + 'images/icon.png'
			});
		var pathr=this.path;
		CKEDITOR.dialog.add( 'scriptTagsDialog', function (api) {
				return {
						 title : 'Embed Scripts (PHP,JS, etc...)',
						 minWidth : 550,
						 minHeight : 200,
						 contents : [
							  {
								 id : 'iframe',
								 label : 'Embed Scripts',
								 expand : true,
								 elements :
									   [
										  {
										   type : 'html',
										   id : 'pageScriptEmbed',
										   label : 'Embed Scripts',
										   style : 'width : 100%;',
										   html : '<iframe src="'+pathr+'/dialogs/scriptembed.php" frameborder="0" name="iframeScriptsEmbed" id="iframeScriptsEmbed" allowtransparency="1" style="width:600px;height:200px;margin:0;padding:0;"></iframe>'
										  }
									   ]
							  }
						 ],
						 onOk : function() {
								for (var i=0; i<window.frames.length; i++) {
									if(window.frames[i].name == 'iframeScriptsEmbed') {
										var content = window.frames[i].document.getElementById("embed").value;
										var script = window.frames[i].document.getElementById("script").value;
									}
								}
								final_html ="";
								if(script=="php") {
									final_html = '<span class="script_embed script_php">\n<?php\n' + content + '\n?>\n</span>';
								} else if(script=="js") {
									final_html = '<span class="script_embed script_js">\n<script language=javascript>\n' + content + '\n</script>\n</span>';
								} else {
									final_html = '<span class="script_embed script_js">\n' + content + '\n</span>';
								}
								//final_html = 'MediaEmbedInsertData|---' + escape('<span class="script_embed">'+content+'</span>') + '---|MediaEmbedInsertData';
								editor.insertHtml(final_html);
								/*updated_editor_data = editor.getData();
								clean_editor_data = updated_editor_data.replace(final_html,'<span class="script_embed">'+content+'</span>');
								editor.setData(clean_editor_data);*/
						 },
					};
			});
		editor.addCss('.scriptTags{padding-left:22px;background-color: #ffffff;' + (CKEDITOR.env.gecko ? 'cursor: default;' : '') + '}');
		editor.addCss('.script_php{padding-left:22px;padding-top:5px;background:url('+this.path + 'images/php1.png'+') no-repeat left center;cursor:pointer;}');
		editor.addCss('.script_js{padding-left:22px;padding-top:5px;background:url('+this.path + 'images/js1.png'+') no-repeat left center;cursor:pointer;}');
		editor.addCommand( 'scriptTags', new CKEDITOR.dialogCommand( 'scriptTagsDialog' ) );
	}
});
