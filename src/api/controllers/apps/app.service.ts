import Account, { IAccount } from '../../models/account';

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
            "App": {
              icon: "$_id.icon",
              live: "$_id.live",
              name: "$_id.name",
              displayName: "$_id.displayName",
              product: "$_id.product",
              industry: "$_id.industry",
              scopes: "$_id.scopes",
            },
            "allAccounts": {
              $filter: {
                input: "$All accounts numbers",
                as: "account",
                cond: { $ne: [ "$$account", null ] }
              }
            },
            "connectedAcounts": {
              $filter: {
                input: "$Accounts connected",
                as: "account",
                cond: { $ne: [ "$$account", null ] }
              }
            }
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
      const update = await Account.updateMany({ bvn: { $regex: `${bvn}`}}, { linked: link}).exec();
      return { error: false, message: `All App ${state} successfully`, data: update };
    }

    // @ts-ignore
    const account = await Account.findOne({ app: apps, bvn: { $regex: `${bvn}`}}).exec();
    if (account === null) return { error: true, message: `App does not exist`}

    if(account.linked === link) return { error: true, message: `App is already ${state}`};
    // @ts-ignore
    const update = await Account.findOneAndUpdate({ app: apps, bvn: { $regex: `${bvn}`}}, { linked: link}).exec();

    return { error: false, message: `App ${state} successfully`, data: update };
  }
}