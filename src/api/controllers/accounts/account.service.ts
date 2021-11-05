import Account, { IAccount } from '../../models/account';
import mongoose from 'mongoose';

export class AccountService {
  constructor() {}

  public async getAccounts(customerId: string, bvn: string) {

    return await Account.aggregate([
      {
        $match: {
          bvn: bvn.length === 4 ? { $regex: `${bvn}$`} : bvn,
          customer: customerId
        },
      },
      {
        $sort: { updated_at: -1 },
      },
      {
        $lookup: {
          from: "institutions",
          localField: "institution",
          foreignField: "_id",
          as: "institution",
        },
      },
      { $unwind: "$institution" },
      {
        $group: {
          _id: "$accountNumber",
          id: { $first: "$_id" },
          accountNumber: { $first: "$accountNumber" },
          name: { $first: "$name" },
          balance: { $first: "$balance" },
          currency: { $first: "$currency" },
          customer: { $first: "$customer" },
          bvn: { $first: "$bvn" },
          linked: { $first: "$linked" },
          type: { $first: "$type" },
          institution: { $first: "$institution" },
          updated_at: { $first: "$updated_at" },
          created_at: { $first: "$created_at" },
        },
      },
      {
          $group: {
              _id: "$institution",
              "noLinkedAccounts": {
                "$sum": { "$cond": [
                    { "$eq": [ "$linked", true ] },
                    1,
                    0
                ]}
               },
               "noValidAccounts": {
                "$sum": { "$cond": [
                    { "$ne": [ "$accountNumber", null ] },
                    1,
                    0
                ]}
               },
              "allAccounts": {
                  $push: "$accountNumber",
              }
          }
      },
      {
        $sort: { updated_at: -1 },
      },
    ]).exec();
  }

  public async toggleAccount(customerId: string, accountNumbers: string, bvn: string, link: boolean): Promise<{ error: boolean, message: string, data?}> {

    const state = link ? 'linked' : 'unlinked';

    if (accountNumbers === 'all') {
      const update = await Account.updateMany({ customerId, bvn: { $regex: `${bvn}$`}}, { linked: link}).exec();
      return { error: false, message: `All Accounts ${state} successfully`, data: update };
    }

    const account = await Account.findOne({ accountNumber: accountNumbers, bvn: { $regex: `${bvn}$`}}).exec();
    if (account === null) return { error: true, message: `Account does not exist`}

    if(account.linked === link) return { error: true, message: `Account is already ${state}`};
    const update = await Account.findOneAndUpdate({ accountNumber: accountNumbers, bvn: { $regex: `${bvn}$`}}, { linked: link}).exec();

    return { error: false, message: `Account ${state} successfully`, data: update };
  }
}