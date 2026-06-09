import mongoose from "mongoose";

const BookMod = require("./models/Book");
const Book = BookMod?.default ?? BookMod;

const CustomerMod = require("./models/Customer");
const Customer = CustomerMod?.default ?? CustomerMod;

const InventoryMod = require("./models/Inventory");
const Inventory = InventoryMod?.default ?? InventoryMod;

const OrderMod = require("./models/Order");
const Order = OrderMod?.default ?? OrderMod;

const TransactionMod = require("./models/Transaction");
const Transaction = TransactionMod?.default ?? TransactionMod;

const BorrowRecordMod = require("./models/BorrowRecord");
const BorrowRecord = BorrowRecordMod?.default ?? BorrowRecordMod;

async function upsertByUnique(model: any, filter: any, doc: any) {
  const existing = await model.findOne(filter);
  if (existing) {
    await model.updateOne(filter, { $set: doc });
    return model.findOne(filter);
  }
  return model.create(doc);
}

export async function seedData() {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const baseSeedDate = new Date("2025-01-01T00:00:00.000Z");

  const pickEnum = (
    model: any,
    pathName: string,
    preferredValues: string[],
    fallback: string,
  ) => {
    const enumValues = (model.schema?.path?.(pathName) as any)?.enumValues;

    if (Array.isArray(enumValues) && enumValues.length > 0) {
      return (
        preferredValues.find((value) => enumValues.includes(value)) ??
        enumValues[0]
      );
    }

    return fallback;
  };

  // 10 Real Books
  const realBooks = [
    {
      isbn: "978-0061120084",
      title: "To Kill a Mockingbird",
      authors: ["Harper Lee"],
      description: "A classic novel of racism and injustice in the American South.",
      category: "Fiction",
      language: "en",
      borrowPrice: 2.5,
      salePrice: 12.99,
    },
    {
      isbn: "978-0451524935",
      title: "1984",
      authors: ["George Orwell"],
      description: "A dystopian social science fiction novel and cautionary tale.",
      category: "Science Fiction",
      language: "en",
      borrowPrice: 2.0,
      salePrice: 9.99,
    },
    {
      isbn: "978-0743273565",
      title: "The Great Gatsby",
      authors: ["F. Scott Fitzgerald"],
      description: "The story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.",
      category: "Fiction",
      language: "en",
      borrowPrice: 1.5,
      salePrice: 8.99,
    },
    {
      isbn: "978-0544003415",
      title: "The Hobbit",
      authors: ["J.R.R. Tolkien"],
      description: "A fantasy novel about the journey of Bilbo Baggins.",
      category: "Fantasy",
      language: "en",
      borrowPrice: 3.0,
      salePrice: 14.99,
    },
    {
      isbn: "978-0307474278",
      title: "The Da Vinci Code",
      authors: ["Dan Brown"],
      description: "A mystery thriller novel exploring a religious conspiracy.",
      category: "Thriller",
      language: "en",
      borrowPrice: 2.5,
      salePrice: 11.99,
    },
    {
      isbn: "978-0553386790",
      title: "A Brief History of Time",
      authors: ["Stephen Hawking"],
      description: "A popular science book about cosmology and theoretical physics.",
      category: "Science",
      language: "en",
      borrowPrice: 3.5,
      salePrice: 16.99,
    },
    {
      isbn: "978-0307949486",
      title: "The Hunger Games",
      authors: ["Suzanne Collins"],
      description: "A dystopian novel set in a future where teens fight to the death.",
      category: "Young Adult",
      language: "en",
      borrowPrice: 2.0,
      salePrice: 10.99,
    },
    {
      isbn: "978-0316769488",
      title: "The Catcher in the Rye",
      authors: ["J.D. Salinger"],
      description: "A story about teenage rebellion and alienation.",
      category: "Fiction",
      language: "en",
      borrowPrice: 1.5,
      salePrice: 8.99,
    },
    {
      isbn: "978-0439023528",
      title: "The Lightning Thief",
      authors: ["Rick Riordan"],
      description: "A modern fantasy about Greek gods and a young demigod.",
      category: "Fantasy",
      language: "en",
      borrowPrice: 2.0,
      salePrice: 9.99,
    },
    {
      isbn: "978-1451673319",
      title: "Fahrenheit 451",
      authors: ["Ray Bradbury"],
      description: "A dystopian novel about a future society that burns books.",
      category: "Science Fiction",
      language: "en",
      borrowPrice: 2.5,
      salePrice: 11.99,
    },
  ];

  // Create 10 books
  const extraBooks = await Promise.all(
    realBooks.map(async (bookData, index) => {
      return upsertByUnique(
        Book,
        { isbn: bookData.isbn },
        {
          title: bookData.title,
          isbn: bookData.isbn,
          authors: bookData.authors,
          description: bookData.description,
          contentType: "book",
          category: bookData.category,
          language: bookData.language,
          borrowPrice: bookData.borrowPrice,
          salePrice: bookData.salePrice,
        },
      );
    }),
  );

  // 10 Real Ethiopian customers (since your schema has Amharic language support)
  const realCustomers = [
    { fullName: "Abebe Kebede", phone: "0911123456", address: "Bole, Addis Ababa" },
    { fullName: "Tigist Haile", phone: "0922123456", address: "Piassa, Addis Ababa" },
    { fullName: "Solomon Desta", phone: "0933123456", address: "Mexico, Addis Ababa" },
    { fullName: "Meron Assefa", phone: "0944123456", address: "CMC, Addis Ababa" },
    { fullName: "Tekle Berhan", phone: "0955123456", address: "Kazanchis, Addis Ababa" },
    { fullName: "Selam Tesfaye", phone: "0916234567", address: "Jemo, Addis Ababa" },
    { fullName: "Yonas Alemayehu", phone: "0927345678", address: "Ayat, Addis Ababa" },
    { fullName: "Hana Gebremichael", phone: "0938456789", address: "Summit, Addis Ababa" },
    { fullName: "Biruk Tsegaye", phone: "0949567890", address: "Sarbet, Addis Ababa" },
    { fullName: "Hiwot Mekonnen", phone: "0950678901", address: "Gerji, Addis Ababa" },
  ];

  const extraCustomers = await Promise.all(
    realCustomers.map(async (customer, index) => {
      return upsertByUnique(
        Customer,
        { phone: customer.phone },
        {
          fullName: customer.fullName,
          phone: customer.phone,
          address: customer.address,
        },
      );
    }),
  );

  // Create inventory for each book
  for (let index = 0; index < extraBooks.length; index++) {
    const totalCopies = [8, 5, 12, 6, 7, 4, 10, 9, 7, 6][index];
    const borrowedCopies = [2, 1, 3, 0, 2, 1, 4, 2, 1, 0][index];
    const soldCopies = [1, 2, 1, 0, 1, 0, 2, 1, 0, 1][index];
    const availableCopies = totalCopies - borrowedCopies - soldCopies;

    await Inventory.findOneAndUpdate(
      { bookId: extraBooks[index]._id },
      {
        $set: {
          bookId: extraBooks[index]._id,
          totalCopies,
          availableCopies,
          borrowedCopies,
          soldCopies,
          minCopiesForBorrowing: [2, 2, 3, 2, 2, 1, 3, 2, 1, 2][index],
        },
      },
      { new: true, upsert: true, runValidators: true },
    );
  }

  // Create orders (borrow and purchase)
  const extraOrders = [];
  
  // Borrow orders
  for (let index = 0; index < Math.min(extraBooks.length, extraCustomers.length); index++) {
    const orderDate = new Date(baseSeedDate.getTime() + index * DAY_MS);
    const book = extraBooks[index];
    const customer = extraCustomers[index];
    
    const order = await upsertByUnique(
      Order,
      {
        bookId: book._id,
        customerId: customer._id,
        orderType: "borrow",
        orderDate,
      },
      {
        bookId: book._id,
        customerId: customer._id,
        orderType: pickEnum(Order, "orderType", ["borrow"], "borrow"),
        orderStatus: pickEnum(
          Order,
          "orderStatus",
          index % 3 === 0 ? ["completed"] : ["pending", "completed"],
          index % 3 === 0 ? "completed" : "pending",
        ),
        orderDate,
        quantity: 1,
      },
    ).catch(() => null);
    
    extraOrders.push(order);
  }
  
  // Add purchase orders
  for (let index = 0; index < 5; index++) {
    const orderDate = new Date(baseSeedDate.getTime() + (index + 10) * DAY_MS);
    const book = extraBooks[index + 5];
    const customer = extraCustomers[index];
    
    const order = await upsertByUnique(
      Order,
      {
        bookId: book._id,
        customerId: customer._id,
        orderType: "purchase",
        orderDate,
      },
      {
        bookId: book._id,
        customerId: customer._id,
        orderType: pickEnum(Order, "orderType", ["purchase"], "purchase"),
        orderStatus: pickEnum(
          Order,
          "orderStatus",
          ["completed", "paid"],
          "completed",
        ),
        orderDate,
        quantity: 1,
      },
    ).catch(() => null);
    
    extraOrders.push(order);
  }

  // Create transactions for orders
  await Promise.all(
    extraOrders.map(async (order: any, index) => {
      if (!order) return null;

      const transactionDate = new Date(
        baseSeedDate.getTime() + index * DAY_MS + 60 * 60 * 1000,
      );
      
      const amount = order.orderType === "borrow" 
        ? [2.5, 2.0, 1.5, 3.0, 2.5, 3.5, 2.0, 1.5, 2.0, 2.5][index % 10]
        : [12.99, 9.99, 8.99, 14.99, 11.99][index % 5];

      return upsertByUnique(
        Transaction,
        { orderId: order._id },
        {
          orderId: order._id,
          bookId: order.bookId,
          customerId: order.customerId,
          transactionType: order.orderType === "borrow" ? "borrow" : "payment",
          type: order.orderType === "borrow" ? "borrow" : "payment",
          amount,
          paymentMethod: pickEnum(
            Transaction,
            "paymentMethod",
            ["cash", "card", "telebirr"],
            "cash",
          ),
          paymentStatus: pickEnum(
            Transaction,
            "paymentStatus",
            ["paid", "completed", "success"],
            "paid",
          ),
          transactionStatus: pickEnum(
            Transaction,
            "transactionStatus",
            ["completed", "success"],
            "completed",
          ),
          status: pickEnum(
            Transaction,
            "status",
            ["completed", "success"],
            "completed",
          ),
          transactionDate,
          paymentDate: transactionDate,
        },
      ).catch(() => null);
    }),
  );

  // Create borrow records
  await Promise.all(
    extraOrders
      .filter(order => order && order.orderType === "borrow")
      .map(async (order: any, index) => {
        if (!order) return null;

        const borrowDate = new Date(baseSeedDate.getTime() + index * DAY_MS);
        const dueDate = new Date(borrowDate.getTime() + 14 * DAY_MS);
        const isReturned = index % 3 !== 1;
        const isOverdue = !isReturned && new Date() > dueDate;

        return upsertByUnique(
          BorrowRecord,
          { orderId: order._id },
          {
            orderId: order._id,
            bookId: order.bookId,
            customerId: order.customerId,
            borrowDate,
            dueDate,
            returnDate: isReturned
              ? new Date(borrowDate.getTime() + (7 + index % 7) * DAY_MS)
              : null,
            status: pickEnum(
              BorrowRecord,
              "status",
              isReturned
                ? ["returned", "completed", "closed"]
                : isOverdue ? ["overdue"] : ["active", "borrowed"],
              isReturned ? "returned" : isOverdue ? "overdue" : "active",
            ),
            recordStatus: pickEnum(
              BorrowRecord,
              "recordStatus",
              isReturned
                ? ["returned", "completed", "closed"]
                : isOverdue ? ["overdue"] : ["active", "borrowed"],
              isReturned ? "returned" : isOverdue ? "overdue" : "active",
            ),
          },
        ).catch(() => null);
      }),
  );
}

// CLI usage: node dist/src/seedData.js (after build)
if (require.main === module) {
  (async () => {
    const { connectDB } = require("./config/database");

    try {
      await connectDB();
      await seedData();
      console.log("✅ Seed completed successfully!");
    } catch (e: any) {
      console.error("❌ Seed failed:", e?.message || e);
      process.exit(1);
    } finally {
      try {
        await mongoose.connection.close();
      } catch {
        // ignore
      }
    }
  })();
}