(async () => {
  try {
    const base = "http://localhost:5000/api";
    function log(label, data) {
      console.log("--- " + label + " ---");
      console.log(JSON.stringify(data, null, 2));
    }

    let res = await fetch(`${base}/books`);
    let list = await res.json();
    let bookId = null;
    if (Array.isArray(list) && list.length > 0) {
      bookId = list[0]._id || (list[0].book && list[0].book._id);
      log("existingBook", list[0]);
    } else {
      res = await fetch(`${base}/books`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "API Test Book",
          authors: ["Tester"],
          isbn: "000-API-" + Date.now(),
          salePrice: 9.99,
          borrowPrice: 1.5,
        }),
      });
      const created = await res.json();
      log("createBook", created);
      bookId = (created && created.book && created.book._id) || created._id;
    }

    res = await fetch(`${base}/customers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Customer",
        phone: "0999999999",
        address: "Test Addr",
      }),
    });
    const customer = await res.json();
    log("createCustomer", customer);
    const customerId = customer._id || (customer && customer._id);

    res = await fetch(`${base}/book-inventory`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bookId: bookId,
        totalCopies: 10,
        availableCopies: 10,
      }),
    });
    const inv = await res.json();
    log("createInventory", inv);

    res = await fetch(`${base}/book-inventory/${bookId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bookId: bookId,
        totalCopies: 20,
        availableCopies: 20,
        borrowedCopies: 0,
        soldCopies: 0,
        minCopiesForBorrowing: 1,
      }),
    });
    const up = await res.json();
    log("updateInventory", up);

    const now = new Date().toISOString();
    res = await fetch(`${base}/orders`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bookId: bookId,
        customerId: customerId,
        orderType: "buy",
        orderStatus: "pending",
        orderDate: now,
        quantity: 1,
      }),
    });
    const ord = await res.json();
    log("createOrder", ord);

    process.exit(0);
  } catch (e) {
    console.error("Test script error:", e);
    process.exit(1);
  }
})();
