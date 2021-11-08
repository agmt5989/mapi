import Account, { IAccount } from '../../models/account';

export class AccountService {
  constructor() {}

  public async getAccounts(bvn: string) {

    return await Account.aggregate([
      {
        $match: {
          bvn: { $regex: `${bvn}$`},
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
              _id: "$institution",
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
            "Institution": {
              identifier: "$_id.identifier",
              name: "$_id.name",
              icon: "$_id.icon",
              bankCode: "$_id.bankCode",
              type: "$_id.type",
              primaryColor: "$_id.primaryColor",
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

  public async toggleAccount(accountNumbers: string, bvn: string, link: boolean): Promise<{ error: boolean, message: string, data?}> {

    const state = link ? 'linked' : 'unlinked';

    if (accountNumbers === 'all') {
      const update = await Account.updateMany({ bvn: { $regex: `${bvn}`}}, { linked: link}).exec();
      return { error: false, message: `All Accounts ${state} successfully`, data: update };
    }

    const account = await Account.findOne({ accountNumber: accountNumbers, bvn: { $regex: `${bvn}`}}).exec();
    if (account === null) return { error: true, message: `Account does not exist`}

    if(account.linked === link) return { error: true, message: `Account is already ${state}`};
    const update = await Account.findOneAndUpdate({ accountNumber: accountNumbers, bvn: { $regex: `${bvn}$`}}, { linked: link}).exec();

    return { error: false, message: `Account ${state} successfully`, data: update };
  }
}