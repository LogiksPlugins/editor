/*
	You Tube Code Embeder for CKeditor
	version 0.4 18/09/2011

	Author : Bismay Kumar Mohapatra
*/
CKEDITOR.plugins.add( 'mediakit',
{
	requires: [ 'iframedialog' ],
	init: function( editor ) {
		editor.ui.addButton( 'mediakit',	{
				label : editor.toolbar,//'mediakit'
				command : 'mediakit',
				icon : this.path + 'images/icon.png'
			});
	   var pathr=this.path;
	   CKEDITOR.dialog.add( 'mediakitDialog', function (api) {
				return {
						 title : 'Embed Media (YouTube,Vimeo, etc...)',
						 minWidth : 550,
						 minHeight : 170,
						 contents : [
							  {
								 id : 'iframe',
								 label : 'Embed Media',
								 expand : true,
								 elements :
									   [
										  {
										   type : 'html',
										   id : 'pageMediaEmbed',
										   label : 'Embed Media',
										   style : 'width : 100%;',
										   html : '<iframe src="'+pathr+'/dialogs/mediaembed.php" frameborder="0" name="iframeMediaEmbed" id="iframeMediaEmbed" allowtransparency="1" style="width:600px;height:170px;margin:0;padding:0;"></iframe>'
										  }
									   ]
							  }
						 ],
						 onOk : function() {
								for (var i=0; i<window.frames.length; i++) {
									if(window.frames[i].name == 'iframeMediaEmbed') {
										var content = window.frames[i].document.getElementById("embed").value;
									}
								}
								final_html = 'MediaEmbedInsertData|---' + escape('<div class="media_embed">'+content+'</div>') + '---|MediaEmbedInsertData';
								editor.insertHtml(final_html);
								updated_editor_data = editor.getData();
								clean_editor_data = updated_editor_data.replace(final_html,'<div class="media_embed">'+content+'</div>');
								editor.setData(clean_editor_data);
						 },
					};
		   });
       editor.addCommand( 'mediakit', new CKEDITOR.dialogCommand( 'mediakitDialog' ) );
	}
});
