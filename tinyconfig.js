var tinySettings= {
		// General options
		mode : "exact",		
		theme : "advanced",
		skin : "o2k7",
		skin_variant : "silver",
		plugins : "lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,inlinepopups,autosave,imgmap",
		
		//tinySettings['skin_variant']='black'; //mode : 'textareas', //readonly : true //plugins : 'noneditable'
		
		// Theme options
		theme_advanced_buttons1 : "newdocument,save,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,imgmap,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "tinymce/style.css",

		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "lists/template_list.js",
		external_link_list_url : "lists/link_list.js",
		external_image_list_url : "lists/image_list.js",
		media_external_list_url : "lists/media_list.js",

		// Replace values for the template plugin
		template_replace_values : {
			username : "Some User",
			staffid : "991234"
		},
		
		setup : function(ed) {
			// Display an alert onclick
			ed.onClick.add(function(ed) {
				//ed.windowManager.alert('User clicked the editor.');
			});

			// Add a custom button
			/*ed.addButton('mybutton', {
				title : 'My button',
				image : 'img/example.gif',
				onclick : function() {
					ed.selection.setContent('<strong>Hello world!</strong>');
				}
			});*/			
		},
		init_instance_callback : function(ed) {
			//ed.execCommand('mceFullPageProperties');
		}
	}
var template_templates= [{
                        title : "Layout Test",
                        src : "tinymce/templates/layout1.htm",
                        description : "Adds Layout :: Name and Staff ID"
                },
                {
						title:"Snippet Test",
						src : "tinymce/templates/snippet1.htm",
						description : "Code Snippet Testing"
				},
                {
                        title : "PHP Templates Test",
                        src : "tinymce/templates/phptest.php",
                        description : "Even PHP Templates Workout."
                }
        ]
