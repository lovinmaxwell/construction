# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe

def execute():
    # add Counstruction
    con = frappe.db.sql("""SELECT name FROM `tabDomain` WHERE upper(name) = upper('Construction')""", as_list=1)
    if len(con) == 0:
        frappe.get_doc(dict(
			doctype='Domain',
			name='Construction',
			domain='Construction'
		)).insert(ignore_permissions=True)
        print ("Adding Construction Domain")
    else:
        print ("Construction Domain Present")
