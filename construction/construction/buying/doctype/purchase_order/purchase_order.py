# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
from frappe.utils import cstr, flt, cint
from frappe import msgprint, _
from frappe.model.mapper import get_mapped_doc


def validate(doc, event):
	print(f"\n\n\n\n\n{doc},{event}")
	# frappe.throw("testinf asndfklabsdlf")

	