import Account, { IAccount } from '../../models/account';
import mongoose from 'mongoose';
import Customer from '../../models/customers';

export class AppService {
  constructor() {}

  public async getApps(bvn: string) {

    return await Account.aggregate([
      {
        $match: {
          bvn: { $regex: bvn },
         
        },
      },
      {
        $lookup: {
          from: "apps",
          localField: "app",
          foreignField: "_id",
          as: "app",
        },
      },
      { $unwind: "$app" },
      {
          $group: {
              _id: "$app",
              "Accounts connected": {
                "$push": {
                    "$cond":[
                        {"$eq":["$linked", true]},
                        {"accountNumber":"$accountNumber"},
                        null
                    ]
                }
              },
              "All Account Numbers": {
                  $push: "$accountNumber",
              }
          }
      },
      {
        $addFields: {
        "Accounts connected": {
          $reduce: {
            input: "$Accounts connected",
            initialValue: [],
            in: {
              $concatArrays: [
                "$$value",
                {
                  $cond: [
                    {
                      $in: [
                        "$$this.accountNumber",
                        "$$value"
                      ]
                    },
                    [],
                    [
                      "$$this.accountNumber"
                    ]
                  ]
                }
              ]
            }
          }
        },
        "All accounts numbers": {
          $reduce: {
            input: "$All Account Numbers",
            initialValue: [],
            in: {
              $concatArrays: [
                "$$value",
                {
                  $cond: [
                    {
                      $in: [
                        "$$this",
                        "$$value"
                      ]
                    },
                    [],
                    [
                      "$$this"
                    ]
                  ]
                }
              ]
            }
          }
        }
        }
      },
      {
        $project: {
            _id: 0,
            "App": "$_id",
            "All accounts numbers":  "$All accounts numbers",
            "Accounts connected": "$Accounts connected"
        }
      },
      {
        $sort: { updated_at: -1 },
      },
    ]).exec();
  }

  public async toggleApps(apps: string, bvn: string, link: boolean): Promise<{ error: boolean, message: string, data?}> {

    const state = link ? 'linked' : 'unlinked';
    
    if (apps === 'all') {
      // @ts-ignore
      const update = await Account.updateMany({ app: apps, bvn: { $regex: `${bvn}`}}, { linked: link}).exec();
      return { error: false, message: `All Accounts ${state} successfully`, data: update };
    }

    // @ts-ignore
    const account = await Account.findOne({ app: apps, bvn: { $regex: `${bvn}`}}).exec();
    if (account === null) return { error: true, message: `Account does not exist`}

    if(account.linked === link) return { error: true, message: `Account is already ${state}`};
    // @ts-ignore
    const update = await Account.findOneAndUpdate({ app: apps, bvn: { $regex: `${bvn}`}}, { linked: link}).exec();

    return { error: false, message: `Account ${state} successfully`, data: update };
  }
}