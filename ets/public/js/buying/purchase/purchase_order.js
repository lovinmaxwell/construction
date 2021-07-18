// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// License: GNU General Public License v3. See license.txt

frappe.provide("erpnext.buying");
frappe.provide('frappe.ui.form');
frappe.provide("frappe.ui.form.handlers");

frappe.ui.form.on("Purchase Order", {

	refresh: function (frm) {
		frm.trigger("amend_po");
		frm.remove_custom_button(__('Update Items'));
		setTimeout(() => {
			frm.remove_custom_button(__('Update Items'));
		}, 500);
	},
	// onload: function (frm) {
	// 	frm.trigger("amend_po");
	// 	frm.remove_custom_button(__('Update Items'));
	// },
	// onload_post_render: function (frm) {
	// 	frm.trigger("amend_po");
	// 	frm.remove_custom_button(__('Update Items'));
	// },
	amend_po: function (frm) {
		var btn_avl = function (label) {
			if (typeof label === 'string') {
				label = [label];
			}
			// translate
			label = label.map(l => __(l));
			return frm.page.inner_toolbar.find(`button[data-label="${encodeURIComponent(label)}"]`).length;
		}

		if (frm.doc.docstatus == 1 && !btn_avl("Amend") && frm.doc.status != "Closed") {
		
			frappe.xcall('frappe.client.is_document_amended', {
				'doctype': frm.doc.doctype,
				'docname': frm.doc.name
			}).then(is_amended => {
				if (is_amended) {
					return;
				}

				frm.add_custom_button(__('Amend'), () => {
					frappe.utils.play_sound("click");
					if (!frm.fields_dict['amended_from']) {
						frappe.msgprint(__('"amended_from" field must be present to do an amendment.'));
						return;
					}

					var validate_form_action = function (action) {
						var perm_to_check = frm.action_perm_type_map[action];
						var allowed_for_workflow = false;
						var perms = frappe.perm.get_perm(frm.doc.doctype)[0];

						// Allow submit, write, cancel and create permissions for read only documents that are assigned by
						// workflows if the user already have those permissions. This is to allow for users to
						// continue through the workflow states and to allow execution of functions like Duplicate.
						if ((frappe.workflow.is_read_only(frm.doctype, frm.docname) && (perms["write"] ||
							perms["create"] || perms["submit"] || perms["cancel"])) || !frappe.workflow.is_read_only(frm.doctype, frm.docname)) {
							allowed_for_workflow = true;
						}

						if (!frm.perm[0][perm_to_check] && !allowed_for_workflow) {
							frappe.throw(__("No permission to '{0}' {1}", [__(action), __(frm.doc.doctype)]));
						}
					}

					var fn = function (newdoc) {
						newdoc.amended_from = frm.docname;
						if (frm.fields_dict && frm.fields_dict['amendment_date'])
							newdoc.amendment_date = frappe.datetime.obj_to_str(new Date());
					};

					validate_form_action("Amend");

					var copy_doc = function (onload, from_amend) {
						validate_form_action("Create");
						var newdoc = frappe.model.copy_doc(frm.doc, from_amend);

						newdoc.idx = null;
						newdoc.__run_link_triggers = false;
						if (onload) {
							onload(newdoc);
						}
						frappe.set_route('Form', newdoc.doctype, newdoc.name);
					}
					// Closing the Document
					frappe.call({
						method: "erpnext.buying.doctype.purchase_order.purchase_order.update_status",
						args: { status: "Closed", name: frm.doc.name },
						callback: function (r) {
							frm.set_value("status", "Closed");
							frm.reload_doc();
						}
					}).then(is_closed => {
						copy_doc(fn, 1);
					});

					frappe.utils.play_sound("click");

				});
			});
		}
	},
});
