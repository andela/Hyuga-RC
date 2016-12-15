import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Deposits = new SimpleSchema({
  amount: {
    type: Number,
    decimal: true,
    label: "Amount"
  },
  referenceId: {
    type: String,
    optional: true
  },
  date: {
    type: Date
  },
  from: {
    type: String,
    optional: true
  }
});

export const Withdrawals = new SimpleSchema({
  amount: {
    type: Number,
    decimal: true,
    label: "Amount"
  },
  to: {
    type: String,
    optional: true
  },
  orderId: {
    type: String,
    optional: true
  },
  date: {
    type: Date
  }
});

export const Wallet = new SimpleSchema({
  userId: {
    type: String,
    label: "User"
  },
  deposits: {
    type: [Deposits],
    optional: true
  },
  withdrawals: {
    type: [Withdrawals],
    optional: true
  },
  balance: {
    type: Number,
    decimal: true,
    defaultValue: 0,
    optional: true
  }
});
