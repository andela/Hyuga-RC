import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const Deposits = new SimpleSchema({
  amount: {
    type: Number,
    label: "Amount"
  },
  referenceId: {
    type: String
  },
  date: {
    type: Date,
    autoValue: () => {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
      this.unset();
    },
    denyUpdate: true
  }
});

export const Transfer = new SimpleSchema({
  amount: {
    type: Number,
    label: "Amount"
  },
  Recipient: {
    type: Number,
    label: "Recipient"
  },
  date: {
    type: Date,
    autoValue: () => {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
      this.unset();
    },
    denyUpdate: true
  }
});

export const Payments = new SimpleSchema({
  amount: {
    type: Number,
    label: "Amount"
  },
  orderId: {
    type: "Order"
  },
  date: {
    type: Date,
    autoValue: () => {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      }
      this.unset();
    },
    denyUpdate: true
  }
});

export const Wallet = new SimpleSchema({
  userId: {
    type: Number,
    label: "User"
  },
  deposit: {
    type: [Deposits]
  },
  transfers: {
    type: [Transfer]
  },
  payments: {
    type: [Payments]
  },
  currentBalance: {
    type: Number
  }
});
