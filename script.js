
show dbs;
use sales_db;
db.sales.insertMany([
  {
    "date": ISODate("2024-06-15T00:00:00Z"),
    "store": "Store A",
    "items": [
      { "name": "item1", "quantity": 5, "price": 10.0 },
      { "name": "item2", "quantity": 3, "price": 20.0 }
    ]
  },
  {
    "date": ISODate("2024-06-16T00:00:00Z"),
    "store": "Store A",
    "items": [
      { "name": "item3", "quantity": 4, "price": 15.0 },
      { "name": "item4", "quantity": 2, "price": 25.0 }
    ]
  },
  {
    "date": ISODate("2024-06-15T00:00:00Z"),
    "store": "Store B",
    "items": [
      { "name": "item1", "quantity": 10, "price": 12.0 },
      { "name": "item2", "quantity": 5, "price": 18.0 }
    ]
  },
  {
    "date": ISODate("2024-06-17T00:00:00Z"),
    "store": "Store B",
    "items": [
      { "name": "item3", "quantity": 7, "price": 14.0 },
      { "name": "item4", "quantity": 6, "price": 30.0 }
    ]
  }
]);

db.sales.find().pretty();

db.sales.aggregate([
  {
    $unwind: "$items"
  },
  {
    $addFields: {
      revenue: { $multiply: ["$items.quantity", "$items.price"] },
      itemPrice: "$items.price"
    }
  },
  {
    $project: {
      store: 1,
      date: 1,
      revenue: 1,
      itemPrice: 1
    }
  },
  {
    $addFields: {
      month: { $dateToString: { format: "%Y-%m", date: "$date" } }
    }
  },
  {
    $group: {
      _id: { store: "$store", month: "$month" },
      totalRevenue: { $sum: "$revenue" },
      avgPrice: { $avg: "$itemPrice" }
    }
  },
  {
    // Sort by store and month
    $sort: { "_id.store": 1, "_id.month": 1 }
  },
  {
    // Final result
    $project: {
      store: "$_id.store",
      month: "$_id.month",
      totalRevenue: 1,
      avgPrice: 1,
      _id: 0
    }
  }
])

