module.exports = {
  getTISPCustomer: async (customerNo) => {
    const data = {
      dueDate: "30/06/2023",
      isActive: true,
    };
    return data;
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
