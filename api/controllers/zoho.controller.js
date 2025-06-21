const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

// Auth: Refresh token to get access_token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: "refresh_token",
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Error refreshing Zoho token", err.response?.data || err);
    throw err;
  }
}

// Generic API call wrapper
async function callZoho(
  endpoint,
  method = "GET",
  data = null,
  extraParams = {}
) {
  const accessToken = await getAccessToken();
  const config = {
    method,
    url: `${process.env.ZOHO_BASE_URL}/${endpoint}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    params: {
      organization_id: process.env.ZOHO_ORG_ID,
      ...extraParams,
    },
  };
  if (data) config.data = data;
  const response = await axios(config);
  return response.data;
}

// Exported module
module.exports = {
  // Local mock (unchanged)
  getCustomerDetails: (customerNo) => {
    const mock = {
      ACC100101: { balance: 2540.75, name: "Alice Kyalo" },
      ACC200202: { balance: 113.4, name: "John Doe" },
    };
    return mock[customerNo] || null;
  },

  // Get all customers
  getZohoCustomers: async (req, res) => {
    try {
      const data = await callZoho("contacts");
      res.json(data.contacts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch customers", details: error.message });
    }
  },

  getSpecificCustomer: async (idOrEmail) => {
    try {
      const zohoCustomerDetails = {
        customer_name: "ET-F502 Alex Nyalita Zoho",
      };

      return zohoCustomerDetails;
      // if (!idOrEmail || idOrEmail.trim().length === 0) {
      //   return "Missing or empty customer identifier.";
      // }

      // const identifier = idOrEmail.trim();

      // // Case: ID (only digits)
      // if (/^\d+$/.test(identifier)) {
      //   const data = await callZoho(`contacts/${identifier}`);
      //   return data.contact || "Customer not found with provided ID.";
      // }

      // // Case: Email address
      // if (identifier.includes("@")) {
      //   const result = await callZoho("contacts", "GET", null, {
      //     email: identifier,
      //   });

      //   if (!result.contacts || result.contacts.length === 0) {
      //     return "Customer not found with provided email.";
      //   }

      //   return result.contacts[0];
      // }

      // // Case: Name or general search text
      // const result = await callZoho("contacts", "GET", null, {
      //   search_text: identifier,
      // });

      // if (!result.contacts || result.contacts.length === 0) {
      //   return "Customer not found with provided name.";
      // }

      // return result.contacts[0];
    } catch (error) {
      console.error(
        "Zoho fetch customer error:",
        error?.response?.data || error.message
      );
      return "Error trying to execute function.";
    }
  },
  // Fetch customer by ID, Email, or Company Name
  // getSpecificCustomer: async (req, res) => {
  //   try {
  //     const { idOrEmail } = req.params;

  //     if (!idOrEmail || idOrEmail.trim().length === 0) {
  //       return res
  //         .status(400)
  //         .json({ error: "Missing or empty customer identifier." });
  //     }

  //     // Case 1: Lookup by Contact ID (all digits)
  //     if (/^\d+$/.test(idOrEmail)) {
  //       const data = await callZoho(`contacts/${idOrEmail}`);
  //       return res.json(data.contact);
  //     }

  //     // Case 2: Lookup by Email
  //     if (idOrEmail.includes("@")) {
  //       const result = await callZoho("contacts", "GET", null, {
  //         email: idOrEmail,
  //       });

  //       if (result.contacts.length === 0) {
  //         return res
  //           .status(404)
  //           .json({ error: "Customer not found with provided email." });
  //       }

  //       return res.json(result.contacts[0]);
  //     }

  //     // Case 3: Lookup by Company Name or Customer Name using `search_text`
  //     const result = await callZoho("contacts", "GET", null, {
  //       search_text: idOrEmail,
  //     });

  //     if (!result.contacts || result.contacts.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ error: "Customer not found with provided name." });
  //     }

  //     return res.json(result.contacts[0]); // return first match
  //   } catch (error) {
  //     console.error(
  //       "Zoho fetch customer error:",
  //       error.response?.data || error.message
  //     );
  //     res.status(500).json({
  //       error: "Failed to fetch customer",
  //       details: error.response?.data || error.message,
  //     });
  //   }
  // },

  // Create invoice
  createInvoice: async (req, res) => {
    try {
      const { customer_id, items } = req.body;

      if (!customer_id || !items?.length) {
        return res.status(400).json({ error: "Missing customer_id or items" });
      }

      const invoiceData = {
        customer_id,
        date: moment().format("YYYY-MM-DD"),
        line_items: items,
      };

      const result = await callZoho("invoices", "POST", invoiceData);
      res.json(result.invoice);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create invoice", details: error.message });
    }
  },

  // Mark invoice as paid
  markInvoiceAsPaid: async (req, res) => {
    try {
      const { invoice_id, customer_id, amount } = req.body;

      if (!invoice_id || !customer_id || !amount) {
        return res
          .status(400)
          .json({ error: "Missing invoice_id, customer_id or amount" });
      }

      const paymentData = {
        customer_id,
        payment_mode: "cash",
        amount,
        date: moment().format("YYYY-MM-DD"),
        invoices: [{ invoice_id, amount_applied: amount }],
      };

      const result = await callZoho("customerpayments", "POST", paymentData);
      res.json(result.payment);
    } catch (error) {
      res.status(500).json({
        error: "Failed to mark invoice as paid",
        details: error.message,
      });
    }
  },

  // Test route
  test: (req, res) => {
    res.json({ message: "Zoho API working ✅" });
  },
};
