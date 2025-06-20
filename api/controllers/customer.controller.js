const moment = require("moment");
const axios = require("axios");

module.exports = {
  getCustomerDetails: (customerNo = "") => {
    const data = {
      contact_id: "4905046000000532348",
      contact_name: "ET-105 F502 Alex  Nyalita",
      customer_name: "ET-105 F502 Alex  Nyalita",
      vendor_name: "ET-105 F502 Alex  Nyalita",
      company_name: "ET-F502",
      website: "",
      language_code: "en",
      language_code_formatted: "English",
      contact_type: "customer",
      contact_type_formatted: "Customer",
      status: "active",
      customer_sub_type: "business",
      source: "user",
      is_linked_with_zohocrm: false,
      payment_terms: 7,
      payment_terms_label: "Net 7",
      currency_id: "4905046000000084096",
      twitter: "",
      facebook: "",
      currency_code: "KES",
      outstanding_receivable_amount: 0,
      outstanding_receivable_amount_bcy: 0,
      outstanding_payable_amount: 0,
      outstanding_payable_amount_bcy: 0,
      unused_credits_receivable_amount: 0,
      unused_credits_receivable_amount_bcy: 0,
      unused_credits_payable_amount: 0,
      unused_credits_payable_amount_bcy: 0,
      first_name: "",
      last_name: "",
      email: "nyalita@gmail.com",
      phone: "",
      mobile: "+254721470212",
      portal_status: "disabled",
      portal_status_formatted: "Disabled",
      created_time: "2024-08-17T10:08:41+0300",
      created_time_formatted: "17 Aug 2024",
      last_modified_time: "2025-03-19T06:11:27+0300",
      last_modified_time_formatted: "19 Mar 2025",
      custom_fields: [],
      custom_field_hash: {},
      tags: [],
      ach_supported: false,
      has_attachment: false,
    };

    return data;
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
