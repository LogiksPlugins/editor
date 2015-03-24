/*
	Clears The Form
	version 0.4 18/09/2011

	Author : Bismay Kumar Mohapatra
*/
CKEDITOR.plugins.add('formbtn',
{
	init: function( editor ) {
		if(((typeof window[CKEDITOR.config.formbtn])!="undefined")) {
			editor.ui.addButton('formbtn',	{
					label : editor.toolbar,
					command : 'formbtn',
					icon : this.path + 'images/icon.png'
				});
			editor.addCommand('formbtn', {
					exec: _newForm,
				});
		}		
	}
});
var _newForm = function() {
	window[CKEDITOR.config.formbtn]();
}
