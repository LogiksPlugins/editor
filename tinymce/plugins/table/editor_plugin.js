/**
 * $Id: editor_plugin_src.js 953 2008-11-04 10:16:50Z spocke $
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2008, Moxiecode Systems AB, All rights reserved.
 */

(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.TablePlugin', {
		init : function(ed, url) {
			var t = this;

			// Create the object that does the table cell resizing
			t.tableResizeContainer = new TableResizeContainer(ed);
			t.editor = ed;
			t.url = url;

			// Register buttons
			each([
				['table', 'table.desc', 'mceInsertTable', true],
				['delete_table', 'table.del', 'mceTableDelete'],
				['delete_col', 'table.delete_col_desc', 'mceTableDeleteCol'],
				['delete_row', 'table.delete_row_desc', 'mceTableDeleteRow'],
				['col_after', 'table.col_after_desc', 'mceTableInsertColAfter'],
				['col_before', 'table.col_before_desc', 'mceTableInsertColBefore'],
				['row_after', 'table.row_after_desc', 'mceTableInsertRowAfter'],
				['row_before', 'table.row_before_desc', 'mceTableInsertRowBefore'],
				['row_props', 'table.row_desc', 'mceTableRowProps', true],
				['cell_props', 'table.cell_desc', 'mceTableCellProps', true],
				['split_cells', 'table.split_cells_desc', 'mceTableSplitCells', true],
				['merge_cells', 'table.merge_cells_desc', 'mceTableMergeCells', true]
			], function(c) {
				ed.addButton(c[0], {title : c[1], cmd : c[2], ui : c[3]});
			});

			if (ed.getParam('inline_styles')) {
				// Force move of attribs to styles in strict mode
				ed.onPreProcess.add(function(ed, o) {
					var dom = ed.dom;

					each(dom.select('table', o.node), function(n) {
						var v;

						if (v = dom.getAttrib(n, 'width')) {
							dom.setStyle(n, 'width', v);
							dom.setAttrib(n, 'width');
						}

						if (v = dom.getAttrib(n, 'height')) {
							dom.setStyle(n, 'height', v);
							dom.setAttrib(n, 'height');
						}
					});
				});

				ed.onEvent.add(function(ed, e) {
					if(e.type=="mousedown"){
						// Turn object resizing on or off
						if(ed.dom.getParent(e.target, "table") != null){
							// Turn object_resizing OFF
							ed.settings.object_resizing = false;
							try {ed.getDoc().execCommand('enableObjectResizing', false, false);
							
							} catch (ex) {}
						}
						else{
							// Turn object_resizing ON
							ed.settings.object_resizing = true;			
							try {ed.getDoc().execCommand('enableObjectResizing', false, true);} catch (ex) {}
						}
					}
				});	
				
				// We want to run over a table when it is inserted
				ed.addCommand('afterInsertTableExecCommand', t.tableResizeContainer.afterInsertTableExecCommandHandler);				
			}

			ed.onInit.add(function() {
				// Setup all event handlers for to enable resizing of table cells				 
				/******************* START OF RESIZING EVENTS *******************/

				tinymce.dom.Event.add(tinyMCE.activeEditor.getDoc(), 'mouseover', t.tableResizeContainer.mouseOver, t.tableResizeContainer);
				tinymce.dom.Event.add(tinyMCE.activeEditor.getDoc(), 'mouseout', t.tableResizeContainer.mouseOut, t.tableResizeContainer);										
				tinymce.dom.Event.add(tinyMCE.activeEditor.getDoc(), 'mousemove', t.tableResizeContainer.mouseMove, t.tableResizeContainer);
				tinymce.dom.Event.add(tinyMCE.activeEditor.getDoc(), 'mousedown', t.tableResizeContainer.mouseDown, t.tableResizeContainer);
				tinymce.dom.Event.add(tinyMCE.activeEditor.getDoc(), 'mouseup', t.tableResizeContainer.mouseUp, t.tableResizeContainer);
				
				/******************* END OF RESIZING EVENTS *******************/ 
				if (ed && ed.plugins.contextmenu) {
					ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
						var sm, se = ed.selection, el = se.getNode() || ed.getBody();

						if (ed.dom.getParent(e, 'td') || ed.dom.getParent(e, 'th')) {
							m.removeAll();

							if (el.nodeName == 'A' && !ed.dom.getAttrib(el, 'name')) {
								m.add({title : 'advanced.link_desc', icon : 'link', cmd : ed.plugins.advlink ? 'mceAdvLink' : 'mceLink', ui : true});
								m.add({title : 'advanced.unlink_desc', icon : 'unlink', cmd : 'UnLink'});
								m.addSeparator();
							}

							if (el.nodeName == 'IMG' && el.className.indexOf('mceItem') == -1) {
								m.add({title : 'advanced.image_desc', icon : 'image', cmd : ed.plugins.advimage ? 'mceAdvImage' : 'mceImage', ui : true});
								m.addSeparator();
							}

							m.add({title : 'table.desc', icon : 'table', cmd : 'mceInsertTable', ui : true, value : {action : 'insert'}});
							m.add({title : 'table.props_desc', icon : 'table_props', cmd : 'mceInsertTable', ui : true});
							m.add({title : 'table.del', icon : 'delete_table', cmd : 'mceTableDelete', ui : true});
							m.addSeparator();

							// Cell menu
							sm = m.addMenu({title : 'table.cell'});
							sm.add({title : 'table.cell_desc', icon : 'cell_props', cmd : 'mceTableCellProps', ui : true});
							sm.add({title : 'table.split_cells_desc', icon : 'split_cells', cmd : 'mceTableSplitCells', ui : true});
							sm.add({title : 'table.merge_cells_desc', icon : 'merge_cells', cmd : 'mceTableMergeCells', ui : true});

							// Row menu
							sm = m.addMenu({title : 'table.row'});
							sm.add({title : 'table.row_desc', icon : 'row_props', cmd : 'mceTableRowProps', ui : true});
							sm.add({title : 'table.row_before_desc', icon : 'row_before', cmd : 'mceTableInsertRowBefore'});
							sm.add({title : 'table.row_after_desc', icon : 'row_after', cmd : 'mceTableInsertRowAfter'});
							sm.add({title : 'table.delete_row_desc', icon : 'delete_row', cmd : 'mceTableDeleteRow'});
							sm.addSeparator();
							sm.add({title : 'table.cut_row_desc', icon : 'cut', cmd : 'mceTableCutRow'});
							sm.add({title : 'table.copy_row_desc', icon : 'copy', cmd : 'mceTableCopyRow'});
							sm.add({title : 'table.paste_row_before_desc', icon : 'paste', cmd : 'mceTablePasteRowBefore'});
							sm.add({title : 'table.paste_row_after_desc', icon : 'paste', cmd : 'mceTablePasteRowAfter'});

							// Column menu
							sm = m.addMenu({title : 'table.col'});
							sm.add({title : 'table.col_before_desc', icon : 'col_before', cmd : 'mceTableInsertColBefore'});
							sm.add({title : 'table.col_after_desc', icon : 'col_after', cmd : 'mceTableInsertColAfter'});
							sm.add({title : 'table.delete_col_desc', icon : 'delete_col', cmd : 'mceTableDeleteCol'});
						} else
							m.add({title : 'table.desc', icon : 'table', cmd : 'mceInsertTable', ui : true});
					});
				}
			});

			// Add undo level when new rows are created using the tab key
			ed.onKeyDown.add(function(ed, e) {
				if (e.keyCode == 9 && ed.dom.getParent(ed.selection.getNode(), 'TABLE')) {
					if (!tinymce.isGecko && !tinymce.isOpera) {
						tinyMCE.execInstanceCommand(ed.editorId, "mceTableMoveToNextRow", true);
						return tinymce.dom.Event.cancel(e);
					}

					ed.undoManager.add();
				}
			});

			// Select whole table is a table border is clicked
			if (!tinymce.isIE) {
				if (ed.getParam('table_selection', true)) {
					ed.onClick.add(function(ed, e) {
						e = e.target;

						if (e.nodeName === 'TABLE')
							ed.selection.select(e);
					});
				}
			}

			ed.onNodeChange.add(function(ed, cm, n) {
				var p = ed.dom.getParent(n, 'td,th,caption');

				cm.setActive('table', n.nodeName === 'TABLE' || !!p);
				if (p && p.nodeName === 'CAPTION')
					p = null;

				cm.setDisabled('delete_table', !p);
				cm.setDisabled('delete_col', !p);
				cm.setDisabled('delete_table', !p);
				cm.setDisabled('delete_row', !p);
				cm.setDisabled('col_after', !p);
				cm.setDisabled('col_before', !p);
				cm.setDisabled('row_after', !p);
				cm.setDisabled('row_before', !p);
				cm.setDisabled('row_props', !p);
				cm.setDisabled('cell_props', !p);
				cm.setDisabled('split_cells', !p || (parseInt(ed.dom.getAttrib(p, 'colspan', '1')) < 2 && parseInt(ed.dom.getAttrib(p, 'rowspan', '1')) < 2));
				cm.setDisabled('merge_cells', !p);
			});

			// Padd empty table cells
			if (!tinymce.isIE) {
				ed.onBeforeSetContent.add(function(ed, o) {
					if (o.initial)
						o.content = o.content.replace(/<(td|th)([^>]+|)>\s*<\/(td|th)>/g, tinymce.isOpera ? '<$1$2>&nbsp;</$1>' : '<$1$2><br mce_bogus="1" /></$1>');
				});
			}
		},

		execCommand : function(cmd, ui, val) {
			var ed = this.editor, b;

			// Is table command
			switch (cmd) {
				case "mceTableMoveToNextRow":
				case "mceInsertTable":
				case "mceTableRowProps":
				case "mceTableCellProps":
				case "mceTableSplitCells":
				case "mceTableMergeCells":
				case "mceTableInsertRowBefore":
				case "mceTableInsertRowAfter":
				case "mceTableDeleteRow":
				case "mceTableInsertColBefore":
				case "mceTableInsertColAfter":
				case "mceTableDeleteCol":
				case "mceTableCutRow":
				case "mceTableCopyRow":
				case "mceTablePasteRowBefore":
				case "mceTablePasteRowAfter":
				case "mceTableDelete":
					ed.execCommand('mceBeginUndoLevel');
					this._doExecCommand(cmd, ui, val);
					ed.execCommand('mceEndUndoLevel');

					return true;
			}

			// Pass to next handler in chain
			return false;
		},

		getInfo : function() {
			return {
				longname : 'Tables',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/table',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		// Private plugin internal methods

		/**
		 * Executes the table commands.
		 */
		_doExecCommand : function(command, user_interface, value) {
			var inst = this.editor, ed = inst, url = this.url;
			var focusElm = inst.selection.getNode();
			var trElm = inst.dom.getParent(focusElm, "tr");
			var tdElm = inst.dom.getParent(focusElm, "td,th");
			var tableElm = inst.dom.getParent(focusElm, "table");
			var doc = inst.contentWindow.document;
			var tableBorder = tableElm ? tableElm.getAttribute("border") : "";

			// Get first TD if no TD found
			if (trElm && tdElm == null)
				tdElm = trElm.cells[0];

			function inArray(ar, v) {
				for (var i=0; i<ar.length; i++) {
					// Is array
					if (ar[i].length > 0 && inArray(ar[i], v))
						return true;

					// Found value
					if (ar[i] == v)
						return true;
				}

				return false;
			}

			function select(dx, dy) {
				var td;

				grid = getTableGrid(tableElm);
				dx = dx || 0;
				dy = dy || 0;
				dx = Math.max(cpos.cellindex + dx, 0);
				dy = Math.max(cpos.rowindex + dy, 0);

				// Recalculate grid and select
				inst.execCommand('mceRepaint');
				td = getCell(grid, dy, dx);

				if (td) {
					inst.selection.select(td.firstChild || td);
					inst.selection.collapse(1);
				}
			};

			function makeTD() {
				var newTD = doc.createElement("td");

				if (!tinymce.isIE)
					newTD.innerHTML = '<br mce_bogus="1"/>';
			}

			function getColRowSpan(td) {
				var colspan = inst.dom.getAttrib(td, "colspan");
				var rowspan = inst.dom.getAttrib(td, "rowspan");

				colspan = colspan == "" ? 1 : parseInt(colspan);
				rowspan = rowspan == "" ? 1 : parseInt(rowspan);

				return {colspan : colspan, rowspan : rowspan};
			}

			function getCellPos(grid, td) {
				var x, y;

				for (y=0; y<grid.length; y++) {
					for (x=0; x<grid[y].length; x++) {
						if (grid[y][x] == td)
							return {cellindex : x, rowindex : y};
					}
				}

				return null;
			}

			function getCell(grid, row, col) {
				if (grid[row] && grid[row][col])
					return grid[row][col];

				return null;
			}

			function getNextCell(table, cell) {
				var cells = [], x = 0, i, j, cell, nextCell;

				for (i = 0; i < table.rows.length; i++)
					for (j = 0; j < table.rows[i].cells.length; j++, x++)
						cells[x] = table.rows[i].cells[j];

				for (i = 0; i < cells.length; i++)
					if (cells[i] == cell)
						if (nextCell = cells[i+1])
							return nextCell;
			}

			function getTableGrid(table) {
				var grid = [], rows = table.rows, x, y, td, sd, xstart, x2, y2;

				for (y=0; y<rows.length; y++) {
					for (x=0; x<rows[y].cells.length; x++) {
						td = rows[y].cells[x];
						sd = getColRowSpan(td);

						// All ready filled
						for (xstart = x; grid[y] && grid[y][xstart]; xstart++) ;

						// Fill box
						for (y2=y; y2<y+sd['rowspan']; y2++) {
							if (!grid[y2])
								grid[y2] = [];

							for (x2=xstart; x2<xstart+sd['colspan']; x2++)
								grid[y2][x2] = td;
						}
					}
				}

				return grid;
			}

			function trimRow(table, tr, td, new_tr) {
				var grid = getTableGrid(table), cpos = getCellPos(grid, td);
				var cells, lastElm;

				// Time to crop away some
				if (new_tr.cells.length != tr.childNodes.length) {
					cells = tr.childNodes;
					lastElm = null;

					for (var x=0; td = getCell(grid, cpos.rowindex, x); x++) {
						var remove = true;
						var sd = getColRowSpan(td);

						// Remove due to rowspan
						if (inArray(cells, td)) {
							new_tr.childNodes[x]._delete = true;
						} else if ((lastElm == null || td != lastElm) && sd.colspan > 1) { // Remove due to colspan
							for (var i=x; i<x+td.colSpan; i++)
								new_tr.childNodes[i]._delete = true;
						}

						if ((lastElm == null || td != lastElm) && sd.rowspan > 1)
							td.rowSpan = sd.rowspan + 1;

						lastElm = td;
					}

					deleteMarked(tableElm);
				}
			}

			function prevElm(node, name) {
				while ((node = node.previousSibling) != null) {
					if (node.nodeName == name)
						return node;
				}

				return null;
			}

			function nextElm(node, names) {
				var namesAr = names.split(',');

				while ((node = node.nextSibling) != null) {
					for (var i=0; i<namesAr.length; i++) {
						if (node.nodeName.toLowerCase() == namesAr[i].toLowerCase() )
							return node;
					}
				}

				return null;
			}

			function deleteMarked(tbl) {
				if (tbl.rows == 0)
					return;

				var tr = tbl.rows[0];
				do {
					var next = nextElm(tr, "TR");

					// Delete row
					if (tr._delete) {
						tr.parentNode.removeChild(tr);
						continue;
					}

					// Delete cells
					var td = tr.cells[0];
					if (td.cells > 1) {
						do {
							var nexttd = nextElm(td, "TD,TH");

							if (td._delete)
								td.parentNode.removeChild(td);
						} while ((td = nexttd) != null);
					}
				} while ((tr = next) != null);
			}

			function addRows(td_elm, tr_elm, rowspan) {
				// Add rows
				td_elm.rowSpan = 1;
				var trNext = nextElm(tr_elm, "TR");
				for (var i=1; i<rowspan && trNext; i++) {
					var newTD = doc.createElement("td");

					if (!tinymce.isIE)
						newTD.innerHTML = '<br mce_bogus="1"/>';

					if (tinymce.isIE)
						trNext.insertBefore(newTD, trNext.cells(td_elm.cellIndex));
					else
						trNext.insertBefore(newTD, trNext.cells[td_elm.cellIndex]);

					trNext = nextElm(trNext, "TR");
				}
			}

			function copyRow(doc, table, tr) {
				var grid = getTableGrid(table);
				var newTR = tr.cloneNode(false);
				var cpos = getCellPos(grid, tr.cells[0]);
				var lastCell = null;
				var tableBorder = inst.dom.getAttrib(table, "border");
				var tdElm = null;

				for (var x=0; tdElm = getCell(grid, cpos.rowindex, x); x++) {
					var newTD = null;

					if (lastCell != tdElm) {
						for (var i=0; i<tr.cells.length; i++) {
							if (tdElm == tr.cells[i]) {
								newTD = tdElm.cloneNode(true);
								break;
							}
						}
					}

					if (newTD == null) {
						newTD = doc.createElement("td");

						if (!tinymce.isIE)
							newTD.innerHTML = '<br mce_bogus="1"/>';
					}

					// Reset col/row span
					newTD.colSpan = 1;
					newTD.rowSpan = 1;

					newTR.appendChild(newTD);

					lastCell = tdElm;
				}

				return newTR;
			}

			// ---- Commands -----

			// Handle commands
			switch (command) {
				case "mceTableMoveToNextRow":
					var nextCell = getNextCell(tableElm, tdElm);

					if (!nextCell) {
						inst.execCommand("mceTableInsertRowAfter", tdElm);
						nextCell = getNextCell(tableElm, tdElm);
					}

					inst.selection.select(nextCell);
					inst.selection.collapse(true);

					return true;

				case "mceTableRowProps":
					if (trElm == null)
						return true;

					if (user_interface) {
						inst.windowManager.open({
							url : url + '/row.htm',
							width : 400 + parseInt(inst.getLang('table.rowprops_delta_width', 0)),
							height : 295 + parseInt(inst.getLang('table.rowprops_delta_height', 0)),
							inline : 1
						}, {
							plugin_url : url
						});
					}

					return true;

				case "mceTableCellProps":
					if (tdElm == null)
						return true;

					if (user_interface) {
						inst.windowManager.open({
							url : url + '/cell.htm',
							width : 400 + parseInt(inst.getLang('table.cellprops_delta_width', 0)),
							height : 295 + parseInt(inst.getLang('table.cellprops_delta_height', 0)),
							inline : 1
						}, {
							plugin_url : url
						});
					}

					return true;

				case "mceInsertTable":
					if (user_interface) {
						inst.windowManager.open({
							url : url + '/table.htm',
							width : 400 + parseInt(inst.getLang('table.table_delta_width', 0)),
							height : 320 + parseInt(inst.getLang('table.table_delta_height', 0)),
							inline : 1
						}, {
							plugin_url : url,
							action : value ? value.action : 0
						});
					}

					return true;

				case "mceTableDelete":
					var table = inst.dom.getParent(inst.selection.getNode(), "table");
					if (table) {
						table.parentNode.removeChild(table);
						inst.execCommand('mceRepaint');
					}
					return true;

				case "mceTableSplitCells":
				case "mceTableMergeCells":
				case "mceTableInsertRowBefore":
				case "mceTableInsertRowAfter":
				case "mceTableDeleteRow":
				case "mceTableInsertColBefore":
				case "mceTableInsertColAfter":
				case "mceTableDeleteCol":
				case "mceTableCutRow":
				case "mceTableCopyRow":
				case "mceTablePasteRowBefore":
				case "mceTablePasteRowAfter":
					// No table just return (invalid command)
					if (!tableElm)
						return true;

					// Table has a tbody use that reference
					// Changed logic by ApTest 2005.07.12 (www.aptest.com)
					// Now lookk at the focused element and take its parentNode.  That will be a tbody or a table.
					if (trElm && tableElm != trElm.parentNode)
						tableElm = trElm.parentNode;

					if (tableElm && trElm) {
						switch (command) {
							case "mceTableCutRow":
								if (!trElm || !tdElm)
									return true;

								inst.tableRowClipboard = copyRow(doc, tableElm, trElm);
								inst.execCommand("mceTableDeleteRow");
								break;

							case "mceTableCopyRow":
								if (!trElm || !tdElm)
									return true;

								inst.tableRowClipboard = copyRow(doc, tableElm, trElm);
								break;

							case "mceTablePasteRowBefore":
								if (!trElm || !tdElm)
									return true;

								var newTR = inst.tableRowClipboard.cloneNode(true);

								var prevTR = prevElm(trElm, "TR");
								if (prevTR != null)
									trimRow(tableElm, prevTR, prevTR.cells[0], newTR);

								trElm.parentNode.insertBefore(newTR, trElm);
								break;

							case "mceTablePasteRowAfter":
								if (!trElm || !tdElm)
									return true;
								
								var nextTR = nextElm(trElm, "TR");
								var newTR = inst.tableRowClipboard.cloneNode(true);

								trimRow(tableElm, trElm, tdElm, newTR);

								if (nextTR == null)
									trElm.parentNode.appendChild(newTR);
								else
									nextTR.parentNode.insertBefore(newTR, nextTR);

								break;

							case "mceTableInsertRowBefore":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(tableElm);
								var cpos = getCellPos(grid, tdElm);
								var newTR = doc.createElement("tr");
								var lastTDElm = null;

								cpos.rowindex--;
								if (cpos.rowindex < 0)
									cpos.rowindex = 0;

								// Create cells
								for (var x=0; tdElm = getCell(grid, cpos.rowindex, x); x++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd['rowspan'] == 1) {
											var newTD = doc.createElement("td");

											if (!tinymce.isIE)
												newTD.innerHTML = '<br mce_bogus="1"/>';

											newTD.colSpan = tdElm.colSpan;

											newTR.appendChild(newTD);
										} else
											tdElm.rowSpan = sd['rowspan'] + 1;

										lastTDElm = tdElm;
									}
								}

								trElm.parentNode.insertBefore(newTR, trElm);
								select(0, 1);
							break;

							case "mceTableInsertRowAfter":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(tableElm);
								var cpos = getCellPos(grid, tdElm);
								var newTR = doc.createElement("tr");
								var lastTDElm = null;

								// Create cells
								for (var x=0; tdElm = getCell(grid, cpos.rowindex, x); x++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd['rowspan'] == 1) {
											var newTD = doc.createElement("td");

											if (!tinymce.isIE)
												newTD.innerHTML = '<br mce_bogus="1"/>';

											newTD.colSpan = tdElm.colSpan;

											newTR.appendChild(newTD);
										} else
											tdElm.rowSpan = sd['rowspan'] + 1;

										lastTDElm = tdElm;
									}
								}

								if (newTR.hasChildNodes()) {
									var nextTR = nextElm(trElm, "TR");
									if (nextTR)
										nextTR.parentNode.insertBefore(newTR, nextTR);
									else
										tableElm.appendChild(newTR);
								}

								select(0, 1);
							break;

							case "mceTableDeleteRow":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(tableElm);
								var cpos = getCellPos(grid, tdElm);

								// Only one row, remove whole table
								if (grid.length == 1 && tableElm.nodeName == 'TBODY') {
									inst.dom.remove(inst.dom.getParent(tableElm, "table"));
									return true;
								}

								// Move down row spanned cells
								var cells = trElm.cells;
								var nextTR = nextElm(trElm, "TR");
								for (var x=0; x<cells.length; x++) {
									if (cells[x].rowSpan > 1) {
										var newTD = cells[x].cloneNode(true);
										var sd = getColRowSpan(cells[x]);

										newTD.rowSpan = sd.rowspan - 1;

										var nextTD = nextTR.cells[x];

										if (nextTD == null)
											nextTR.appendChild(newTD);
										else
											nextTR.insertBefore(newTD, nextTD);
									}
								}

								// Delete cells
								var lastTDElm = null;
								for (var x=0; tdElm = getCell(grid, cpos.rowindex, x); x++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd.rowspan > 1) {
											tdElm.rowSpan = sd.rowspan - 1;
										} else {
											trElm = tdElm.parentNode;

											if (trElm.parentNode)
												trElm._delete = true;
										}

										lastTDElm = tdElm;
									}
								}

								deleteMarked(tableElm);

								select(0, -1);
							break;

							case "mceTableInsertColBefore":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(inst.dom.getParent(tableElm, "table"));
								var cpos = getCellPos(grid, tdElm);
								var lastTDElm = null;

								for (var y=0; tdElm = getCell(grid, y, cpos.cellindex); y++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd['colspan'] == 1) {
											var newTD = doc.createElement(tdElm.nodeName);

											if (!tinymce.isIE)
												newTD.innerHTML = '<br mce_bogus="1"/>';

											newTD.rowSpan = tdElm.rowSpan;

											tdElm.parentNode.insertBefore(newTD, tdElm);
										} else
											tdElm.colSpan++;

										lastTDElm = tdElm;
									}
								}

								select();
							break;

							case "mceTableInsertColAfter":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(inst.dom.getParent(tableElm, "table"));
								var cpos = getCellPos(grid, tdElm);
								var lastTDElm = null;

								for (var y=0; tdElm = getCell(grid, y, cpos.cellindex); y++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd['colspan'] == 1) {
											var newTD = doc.createElement(tdElm.nodeName);

											if (!tinymce.isIE)
												newTD.innerHTML = '<br mce_bogus="1"/>';

											newTD.rowSpan = tdElm.rowSpan;

											var nextTD = nextElm(tdElm, "TD,TH");
											if (nextTD == null)
												tdElm.parentNode.appendChild(newTD);
											else
												nextTD.parentNode.insertBefore(newTD, nextTD);
										} else
											tdElm.colSpan++;

										lastTDElm = tdElm;
									}
								}

								select(1);
							break;

							case "mceTableDeleteCol":
								if (!trElm || !tdElm)
									return true;

								var grid = getTableGrid(tableElm);
								var cpos = getCellPos(grid, tdElm);
								var lastTDElm = null;

								// Only one col, remove whole table
								if ((grid.length > 1 && grid[0].length <= 1) && tableElm.nodeName == 'TBODY') {
									inst.dom.remove(inst.dom.getParent(tableElm, "table"));
									return true;
								}

								// Delete cells
								for (var y=0; tdElm = getCell(grid, y, cpos.cellindex); y++) {
									if (tdElm != lastTDElm) {
										var sd = getColRowSpan(tdElm);

										if (sd['colspan'] > 1)
											tdElm.colSpan = sd['colspan'] - 1;
										else {
											if (tdElm.parentNode)
												tdElm.parentNode.removeChild(tdElm);
										}

										lastTDElm = tdElm;
									}
								}

								select(-1);
							break;

						case "mceTableSplitCells":
							if (!trElm || !tdElm)
								return true;

							var spandata = getColRowSpan(tdElm);

							var colspan = spandata["colspan"];
							var rowspan = spandata["rowspan"];

							// Needs splitting
							if (colspan > 1 || rowspan > 1) {
								// Generate cols
								tdElm.colSpan = 1;
								for (var i=1; i<colspan; i++) {
									var newTD = doc.createElement("td");

									if (!tinymce.isIE)
										newTD.innerHTML = '<br mce_bogus="1"/>';

									trElm.insertBefore(newTD, nextElm(tdElm, "TD,TH"));

									if (rowspan > 1)
										addRows(newTD, trElm, rowspan);
								}

								addRows(tdElm, trElm, rowspan);
							}

							// Apply visual aids
							tableElm = inst.dom.getParent(inst.selection.getNode(), "table");
							break;

						case "mceTableMergeCells":
							var rows = [];
							var sel = inst.selection.getSel();
							var grid = getTableGrid(tableElm);

							if (tinymce.isIE || sel.rangeCount == 1) {
								if (user_interface) {
									// Setup template
									var sp = getColRowSpan(tdElm);

									inst.windowManager.open({
										url : url + '/merge_cells.htm',
										width : 240 + parseInt(inst.getLang('table.merge_cells_delta_width', 0)),
										height : 110 + parseInt(inst.getLang('table.merge_cells_delta_height', 0)),
										inline : 1
									}, {
										action : "update",
										numcols : sp.colspan,
										numrows : sp.rowspan,
										plugin_url : url
									});

									return true;
								} else {
									var numRows = parseInt(value['numrows']);
									var numCols = parseInt(value['numcols']);
									var cpos = getCellPos(grid, tdElm);

									if (("" + numRows) == "NaN")
										numRows = 1;

									if (("" + numCols) == "NaN")
										numCols = 1;

									// Get rows and cells
									var tRows = tableElm.rows;
									for (var y=cpos.rowindex; y<grid.length; y++) {
										var rowCells = [];

										for (var x=cpos.cellindex; x<grid[y].length; x++) {
											var td = getCell(grid, y, x);

											if (td && !inArray(rows, td) && !inArray(rowCells, td)) {
												var cp = getCellPos(grid, td);

												// Within range
												if (cp.cellindex < cpos.cellindex+numCols && cp.rowindex < cpos.rowindex+numRows)
													rowCells[rowCells.length] = td;
											}
										}

										if (rowCells.length > 0)
											rows[rows.length] = rowCells;

										var td = getCell(grid, cpos.rowindex, cpos.cellindex);
										each(ed.dom.select('br', td), function(e, i) {
											if (i > 0 && ed.dom.getAttrib('mce_bogus'))
												ed.dom.remove(e);
										});
									}

									//return true;
								}
							} else {
								var cells = [];
								var sel = inst.selection.getSel();
								var lastTR = null;
								var curRow = null;
								var x1 = -1, y1 = -1, x2, y2;

								// Only one cell selected, whats the point?
								if (sel.rangeCount < 2)
									return true;

								// Get all selected cells
								for (var i=0; i<sel.rangeCount; i++) {
									var rng = sel.getRangeAt(i);
									var tdElm = rng.startContainer.childNodes[rng.startOffset];

									if (!tdElm)
										break;

									if (tdElm.nodeName == "TD" || tdElm.nodeName == "TH")
										cells[cells.length] = tdElm;
								}

								// Get rows and cells
								var tRows = tableElm.rows;
								for (var y=0; y<tRows.length; y++) {
									var rowCells = [];

									for (var x=0; x<tRows[y].cells.length; x++) {
										var td = tRows[y].cells[x];

										for (var i=0; i<cells.length; i++) {
											if (td == cells[i]) {
												rowCells[rowCells.length] = td;
											}
										}
									}

									if (rowCells.length > 0)
										rows[rows.length] = rowCells;
								}

								// Find selected cells in grid and box
								var curRow = [];
								var lastTR = null;
								for (var y=0; y<grid.length; y++) {
									for (var x=0; x<grid[y].length; x++) {
										grid[y][x]._selected = false;

										for (var i=0; i<cells.length; i++) {
											if (grid[y][x] == cells[i]) {
												// Get start pos
												if (x1 == -1) {
													x1 = x;
													y1 = y;
												}

												// Get end pos
												x2 = x;
												y2 = y;

												grid[y][x]._selected = true;
											}
										}
									}
								}

								// Is there gaps, if so deny
								for (var y=y1; y<=y2; y++) {
									for (var x=x1; x<=x2; x++) {
										if (!grid[y][x]._selected) {
											alert("Invalid selection for merge.");
											return true;
										}
									}
								}
							}

							// Validate selection and get total rowspan and colspan
							var rowSpan = 1, colSpan = 1;

							// Validate horizontal and get total colspan
							var lastRowSpan = -1;
							for (var y=0; y<rows.length; y++) {
								var rowColSpan = 0;

								for (var x=0; x<rows[y].length; x++) {
									var sd = getColRowSpan(rows[y][x]);

									rowColSpan += sd['colspan'];

									if (lastRowSpan != -1 && sd['rowspan'] != lastRowSpan) {
										alert("Invalid selection for merge.");
										return true;
									}

									lastRowSpan = sd['rowspan'];
								}

								if (rowColSpan > colSpan)
									colSpan = rowColSpan;

								lastRowSpan = -1;
							}

							// Validate vertical and get total rowspan
							var lastColSpan = -1;
							for (var x=0; x<rows[0].length; x++) {
								var colRowSpan = 0;

								for (var y=0; y<rows.length; y++) {
									var sd = getColRowSpan(rows[y][x]);

									colRowSpan += sd['rowspan'];

									if (lastColSpan != -1 && sd['colspan'] != lastColSpan) {
										alert("Invalid selection for merge.");
										return true;
									}

									lastColSpan = sd['colspan'];
								}

								if (colRowSpan > rowSpan)
									rowSpan = colRowSpan;

								lastColSpan = -1;
							}

							// Setup td
							tdElm = rows[0][0];
							tdElm.rowSpan = rowSpan;
							tdElm.colSpan = colSpan;

							// Merge cells
							for (var y=0; y<rows.length; y++) {
								for (var x=0; x<rows[y].length; x++) {
									var html = rows[y][x].innerHTML;
									var chk = html.replace(/[ \t\r\n]/g, "");

									if (chk != "<br/>" && chk != "<br>" && chk != '<br mce_bogus="1"/>' && (x+y > 0))
										tdElm.innerHTML += html;

									// Not current cell
									if (rows[y][x] != tdElm && !rows[y][x]._deleted) {
										var cpos = getCellPos(grid, rows[y][x]);
										var tr = rows[y][x].parentNode;

										tr.removeChild(rows[y][x]);
										rows[y][x]._deleted = true;

										// Empty TR, remove it
										if (!tr.hasChildNodes()) {
											tr.parentNode.removeChild(tr);

											var lastCell = null;
											for (var x=0; cellElm = getCell(grid, cpos.rowindex, x); x++) {
												if (cellElm != lastCell && cellElm.rowSpan > 1)
													cellElm.rowSpan--;

												lastCell = cellElm;
											}

											if (tdElm.rowSpan > 1)
												tdElm.rowSpan--;
										}
									}
								}
							}

							// Remove all but one bogus br
							each(ed.dom.select('br', tdElm), function(e, i) {
								if (i > 0 && ed.dom.getAttrib(e, 'mce_bogus'))
									ed.dom.remove(e);
							});

							break;
						}

						tableElm = inst.dom.getParent(inst.selection.getNode(), "table");
						inst.addVisual(tableElm);
						inst.nodeChanged();
					}

				return true;
			}

			// Pass to next handler in chain
			return false;
		}
	});

	/**
	 * Rectangle class. Used for cell resizing
	 * @param x x-coordinate
	 * @param y y-coordinate
	 * @param w width
	 * @param h height
	 * @param resizableCell a ResizableCell object
	 */
	function Rectangle(x, y, w, h, resizableCell){
		//console.log("Creating Rectangle: x,y,w,h: " + x + ", " + y + ", " + w + ", " + h);
		// Set up initial values
		this._x = x;
		this._y = y;
		this._w = w;
		this._h = h;
		this._resizableCell = resizableCell;
		this._active = false;
		
		/**
		 * Collision detection method. One day I'll write a version of Pacman but
		 * for now my collision detecting is within the confines of whether the user
		 * has moved their mouse over a hotspot area which could be potentially dragged
		 * @param x - the x position of the cursor
		 * @param y - the y position of the cursor
		 * @return true if collided, false if not
		 */
		this.isCollided = function(x, y){
			return (x >= this._x && x < (this._x + this._w)) && (y >= this._y && y < (this._y + this._h));		
		},
		
		/**
		 * Make the rectangle active and set the cursor style accordingly
		 * @param active true if active, false if not
		 */
		this.setActive = function(active){
			this._active = active;
			if(active){
				this._resizableCell._cell.style.cursor = "w-resize";
			}
			else{
				this._resizableCell._cell.style.cursor = "default";
			}
		},
		
		/**
		 * Simple getter telling us whether the rectangle is active or not
		 */
		this.isActive = function(){
			return this._active;
		}
	}

	/**
	 * Resizable Cell. Created when a cell is being resized.
	 * This is really just a logical wrapper extension around 
	 * the DOM cell object.
	 * @param c DOM TD object which is to be wrapped.
	 */
	function ResizableCell(c){
		
		// Initialise values for Resizable Cell
		this._id = null;	
		this._cell = c;
		this._resizing = false;
		
		/* Getters and Setters here */
		
		this.getId = function(){
			return this._id;
		},
		
		this.setId = function(id){
			this._id = id;
		},
		
		this.getCell = function(){
			return this._cell;
		},
		
		this.getResizing = function(){
			return this._resizing;
		},

		this.setResizing = function(r){
			this._resizing = r;
		}	
	}

	/**
	 * Table utility class. Holds all the virtual rectangles in an array
	 * and contains general table methods concerning resize operations
	 * @param ed the editor we are dealing with. This is so that we don't
	 *           have to have a fully qualified reference.
	 */
	function TableResizeContainer(ed){

		// Setup initial values
		this._dirty = false;
		this._hotspots = new Array();
		this._editor = ed;
		this._currentlyResizing = false;
		this._resizable = false;
		this._maxTableWidth = (ed.getParam('table_max_width') == null || ed.getParam('table_max_width') == "") ? 545 : ed.getParam('table_max_width');
		this._minTableWidth = (ed.getParam('table_min_width') == null || ed.getParam('table_min_width') == "") ? 90 : ed.getParam('table_min_width');
		
		/* GETTERS AND SETTERS */
		
		this.getHotspots = function(){
			return this._hotspots;
		},
		
		this.setHotspots = function(h){
			this._hotspots = h;
		},
		
		this.isDirty = function(){
			return this._dirty;
		},
		
		this.setIsDirty = function(d){
			this._dirty = d;
		},
		
		this.getCurrentlyResizing = function(){
			return this._currentlyResizing;
		},

		this.setCurrentlyResizing = function(r){
			this._currentlyResizing = r;
		},	
		
		this.getResizable = function(){
			return this._resizable;
		},

		this.setResizable = function(r){
			this._resizable = r;
		},

		/**
		 * Recalculates the array of rectangles by selecting all
		 * the tables in the editor, cycling through their cells 
		 * and creating a rectangle for the cell, which is then
		 * added to the hotspot array.
		 * @param ed the tinyMCE editor
		 */
		this.refreshHotSpots = function(ed){
			var DOM = ed.dom;
			var xOffset = -1;
			var x=0,y=0,w=7,h=0;								
			// Clear _tableRectangles
			var hs = new Array();
			// Finally create rectangles to serve as collision detectors
			DOM.run(DOM.select('table'), function(n){	
				for(var row=0;row<n.rows.length;row++){
					for(var cell=0;cell<n.rows[row].cells.length;cell++){
						x = n.offsetLeft + n.tBodies[0].offsetLeft + n.rows[row].cells[cell].clientWidth + xOffset + 1;
						y = n.offsetTop - ed.getDoc().body.scrollTop;
						h = n.clientHeight;
						xOffset += n.tBodies[0].offsetLeft + n.rows[row].cells[cell].clientWidth + 1;
						// Push rectangle onto rectangle array
						hs.push(new Rectangle(x, y, w, h, new ResizableCell(n.rows[row].cells[cell])));						
					}
					xOffset = 0;
				}
			});
			this._hotspots = hs;
		},
		
		// Clear the hotspot array by reinitializing it
		this.clearHotspots = function(){
			this._hotspots = new Array();
		},
		
		/**
		 * Find the rectangle that we have collided with
		 * x the mouse x-coordinate
		 * y the mouse y-coordinate
		 * Return Rectangle if a collision occurred otherwise return null 
		 */
		this.getRectCollided = function(x, y){
			var result = null;
			for (var i=0;i<this._hotspots.length;i++){
				if(this._hotspots[i].isCollided(x,y)){
					this._hotspots[i].setActive(true);
					result = this._hotspots[i];
				}
				else{
					this._hotspots[i].setActive(false);
				}  
			}		
			return result;
		},
		
		/**
		 * Does the container currently have an active rectangle
		 * Return true if yes and false if no
		 */						
		this.hasActiveRect = function(){
			for (var i=0;i<this._hotspots.length;i++){
				if(this._hotspots[i].isActive()){
					return true;
				}
			}	
			return false;			
		},
		
		/**
		 * If there is a collision, set an active hotspot
		 * @param e the mouse event
		 */
		this.setActiveRect = function(e){
			var rect = this.getRectCollided(e.clientX, e.clientY);			
			if(rect != null){
				//console.log("Setting active rect: " + rect._x);
				rect.setActive(true);
			}		
		},
		
		/**
		 * Assumes that we have a resizable cell to return.
		 * Gets the cell from the active rectangle.
		 * @return a ResizableCell or null if none found
		 */	
		this.getResizableCell = function(){
			for (var i=0;i<this._hotspots.length;i++){
				if(this._hotspots[i].isActive()){
					return this._hotspots[i]._resizableCell;
				}
			}	
			return null;						
		},
		
		/**
		 * Get the start x-coordinate of the resize
		 */
		this.getStartX = function(){
			return this.startX;
		},

		/**
		 * Set the start x-coordinate of the resize
		 * startX the x-coordinate
		 */
		this.setStartX = function(x){
			this.startX = x;
		}, 
		
		/**
		 * Resize the cell that has just been dragged
		 * @param ed tinyMCE editor
		 * @param c cell
		 * @param t table
		 * @param e mouseUp event
		 * @param tCells array of TD objects
		 * 
		 */
		this.resizeCell = function(ed, c, t, e, tCells){
			//console.log("Called resizeCell...");
			
			// Cell should be resized to within its own limits				
			// First check if the user has moved the resize bar outside of the 'right' limit
			if(c.nextSibling != null && c.nextSibling.nodeName == "TD"){
				if(e.clientX > t.offsetLeft + c.nextSibling.offsetLeft + c.nextSibling.offsetWidth){
					this.removeResizeGuides(ed, t);
					return;
				}
			}
			// Second check if the user has moved the resize bar outside of the 'left' limit
			if(e.clientX <= t.offsetLeft + c.offsetLeft){
				this.removeResizeGuides(ed, t);
				return;					
			}
			
			var tr = ed.dom.getParent(c, "tr");
			// The user has dropped the guide to a valid location so proceed
			// Cell width should be distance from table offset to mouse cursor
			c.style.width = e.clientX - t.offsetLeft - c.offsetLeft + "px";
			// Move to the next cell in the array unless at the end of a row 
			var n = this.moveToNextCell(c, tCells);					
			if(n != null){
				// If we are in here, we found the next cell
				n.style.width = parseInt(n.offsetWidth) + (this.getStartX() - e.clientX) + "px";
			}
			else{
				// Re-adjust the table by the amount of the row
				var tWidth = 0;
				for(var m=0;m<tr.cells.length;m++){
					var cell = tr.cells[m];
					// Assumes cell has a width set on the style
					tWidth += parseInt(cell.offsetWidth);
				}
				t.style.width = tWidth + "px";
			}
			// Re-adjust the other rows
			this.resizeAllRows(t.rows, tr);
		},
		
		/**
		 * Get the total width of a row
		 * @param tr the row to inspect
		 * @param tc ignore this cell
		 * @return the total width
		 */
		this.getTotalWidth = function(tr, tc){
			// Readjust the total width
			var totalWidth = 0;				
			for (var i=0;i<tr.cells.length;i++){
				// Use the offsetWidth to make sure we get the actual cell width
				if(tr.cells[i] != tc)
					totalWidth += tr.cells[i].offsetWidth;
			}
			return totalWidth;
		},
		
		/**
		 * If the total width of a row is beyond the pale then adjust it
		 * @param tw the current total width
		 * @param tr the row to use for the new total width
		 */
		this.tweakTotalWidth = function(tw, tr){
			var tweak = (tw - this._maxTableWidth) / tr.cells.length;
			for (var j=0;j<tr.cells.length;j++){
				tr.cells[j].style.width = parseInt(tr.cells[j].style.width) - tweak + "px";
				//console.log("cell width = "+tr.cells[j].style.width);
			}
		},
		
		/**
		 * Resize all other rows
		 * @param rows array of rows
		 * @param tr the current row
		 */
		this.resizeAllRows = function(rows, tr){
			for(var p=0;p<rows.length;p++){
				var row = rows[p];
				// Check we are not dealing with our resized row and that the number
				// of cells is the same in the other row
				if(row != tr && row.cells.length==tr.cells.length){
					for(var q=0;q<row.cells.length;q++){
						var cell = row.cells[q];
						cell.style.width = tr.cells[q].style.width;
					}
				}
			}					
		},
		
		/**
		 * Removes the resize guide DOM objects from the tree that we used
		 * to keep the user informed of the drag progress
		 * @param ed the tinyMCE editor
		 * @param t table
		 */
		this.removeResizeGuides = function(ed, t){
			// Reset variables. Should really use something other than a global here.
			this.setStartX(0);
			
			// Remove the guides
			ed.dom.remove(this.getResizableCell().getId());
			ed.dom.remove('tableCloth');
			ed.dom.remove('page');
			
			// The resize is over
			this.setResizable(false);
			this.setCurrentlyResizing(false);
		
			// Do a repaint
			ed.execCommand('mceRepaint'); 					
			
			// Get the last undo off the stack
			ed.undoManager.data.pop();	
			ed.undoManager.index--;				
		},
		
		/**
		 * Move the focus to the next cell
		 * @param c cell we are on at the moment
		 * @param tCells array of cells so we can move to next easily
		 * @return the next cell in sequence or null if none found
		 */
		this.moveToNextCell = function(c, tCells){
			for(var i=0;i<tCells.length;i++){
				if(c == tCells[i] && i<tCells.length-1){
					if(!this.isBoundaryCell(tCells[i])){
						return tCells[i+1];
					}
					else{
						return null;
					}
				}
			}
			return null;		
		},

		/**
		 * Checks whether the cell in question is the last one in a row
		 * @param c the cell to test
		 * @return true if the cell is the last one in a row 
		 */
		this.isBoundaryCell = function(c){
			// This should work for rows with merged cells as well
			var numCellsInRow = c.parentNode.cells.length;
			if(numCellsInRow - c.cellIndex == 1){
				return true;
			}
			else{
				return false;
			}			
		},
		
		/**
		 * Called when there is a mouseover in the document. Though
		 * we filter out most of the events.
		 * 
		 * @param e the mouseover event
		 */
		this.mouseOver = function(e){
			if(e.target.nodeName == "TD"){
				if(this.isDirty()){
					this.refreshHotSpots(this._editor);
					this.setIsDirty(false);				
				}
			}		
		},
		
		/**
		 * Called when there is a mouseout in the document. Though
		 * we filter out most of the events.
		 * 
		 * @param e the mouseout event
		 */
		this.mouseOut = function(e) {
			if(e.target.nodeName == "TABLE" || e.target.nodeName == "TD"){
				this.setIsDirty(true);				
			}
		},
		
		/**
		 * Called when there is a mousemove in the document. Though
		 * we filter out most of the events.
		 * 
		 * @param e the mousemove event
		 */
		this.mouseMove = function(e) {
			if(this.getCurrentlyResizing() && this.getResizableCell() != null){
				this._editor.dom.get(this.getResizableCell().getId()).style.left = e.clientX + "px";
				return;				
			}
			if("TD" == e.target.nodeName){
				this.setActiveRect(e);
			}
		},
		
		/**
		 * Called when there is a mousedown in the document. Though
		 * we filter out most of the events.
		 * 
		 * @param e the mousedown event
		 */
		this.mouseDown = function(e) {
			if("TD" == e.target.nodeName && this.hasActiveRect()){	
				this.setCurrentlyResizing(true);
				this.setStartX(e.clientX);
				
				// Get the table parent of the cell
				var table = this._editor.dom.getParent(e.target, "table");
				var doc = this._editor.getDoc();
				
				// Create an invisible div over the top
				// NOTE - THIS SHOULD REALLY USE SOME COMMON ELEMENT CREATION FUNCTION WITH JSON PARAMS
				var pagediv = doc.createElement('div');
				pagediv.id = "page";
				pagediv.style.width = "100%";
				pagediv.style.height = "100%";
				pagediv.style.background = "transparent";
				pagediv.style.opacity = "0";
				pagediv.style.position = "absolute";
				pagediv.style.zIndex = "99";
				pagediv.style.top = "0px";
				pagediv.style.left = "0px";
				
				// Create a div on top of the table
				var tdiv = doc.createElement('div');
				tdiv.id = "tableCloth";
				tdiv.style.width = table.clientWidth + "px";
				tdiv.style.height = table.clientHeight + "px";
				tdiv.style.border = "1px dashed black";
				tdiv.style.background = "transparent";
				tdiv.style.backgroundColor = "#F8F8FF";
				tdiv.style.opacity = "0.5";
				tdiv.style.position = "absolute";
				tdiv.style.zIndex = "100";
				tdiv.style.top = table.offsetTop + "px";
				tdiv.style.left = table.offsetLeft + "px";
				
				// Create div at mouse
				var div = doc.createElement('div');
				div.id = "resizeCell"
				// Echo this reference to the TableResizeContainer
				this.getResizableCell().setId(div.id);
				div.style.width = "2px";
				div.style.cursor = "w-resize!important";
				div.style.height = table.offsetHeight + "px";
				div.style.background = "black"
				div.style.position = "absolute";
				div.style.zIndex = "101";
				div.style.top = table.offsetTop + "px";
				div.style.left = e.clientX + "px";
				
				// Attach divs to doc
				doc.body.appendChild(tdiv);
				doc.body.appendChild(div);
				doc.body.appendChild(pagediv);
			} 
		},
		
		/**
		 * Called when there is a mouseup in the document. Though
		 * we filter out most of the events.
		 * 
		 * @param e the mouseup event
		 */
		this.mouseUp = function(e) {
			if(this.getCurrentlyResizing()){
				// Get the table parent of the cell		
						
				try {
					var c = this.getResizableCell().getCell();
					var t = this._editor.dom.getParent(c, "table");		
					// Put all the cells into an array to help us find the next one reliably later
					var tCells = this._editor.dom.select('td', t);
					
					// Resize the cell
					if(c!=null && c.cellIndex < t.rows[0].cells.length){
						this.resizeCell(this._editor, c, t, e, tCells);
					}
				} catch(ex){t = null;}
				// Cleanup after us
				this.removeResizeGuides(this._editor, t);
				
				// Reset the active region because we are still there
				this.setActiveRect(e);
			}
		},
		
		this.afterInsertTableExecCommandHandler = function(ui, v){
			var ed1 = tinyMCE.activeEditor;

			// Replace the table first row column styles
			ed1.dom.run(ed1.dom.select('table'), function(n){
				for (var i=0;i<n.rows.length;i++)
				{
					for (var j=0;j<n.rows[i].length;j++){
						if(n.rows[i][j].style != null && n.rows[i][j].style != undefined){
							// If no cell width present then add it
							if(/px/.exec(n.rows[i][j].style.width) == null){
								n.rows[i][j].style.width = n.clientWidth / n.rows[i][j].length + "px";
							}
						}
					}
				}
			});
		}
	}

	// Register plugin
	tinymce.PluginManager.add('table', tinymce.plugins.TablePlugin);
})();