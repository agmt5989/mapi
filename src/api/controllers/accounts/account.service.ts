import Account, { IAccount } from "../../models/account";

export class AccountService {
  constructor() {}

  /**
   *
   * @param bvn unique bvn of the customer
   * @returns {[ institution : {}, connectedAccounts: [], allaccounts: [] ]}
   */
  public async getAccounts(bvn: string) {
    return await Account.aggregate([
      // match by the bvn of the customer
      {
        $match: {
          bvn: { $regex: `${bvn}$` },
        },
      },
      // looks up by institution id to get the complete object returned
      {
        $lookup: {
          from: "institutions",
          localField: "institution",
          foreignField: "_id",
          as: "institution",
        },
      },
      { $unwind: "$institution" },
      // Groups entries that match bvn query by the institution
      {
        $group: {
          _id: "$institution",
          "Accounts connected": {
            $push: {
              $cond: [
                { $eq: ["$linked", true] },
                { accountNumber: "$accountNumber" },
                null,
              ],
            },
          },
          "All Account Numbers": {
            $push: "$accountNumber",
          },
        },
      },
      // This adds field to ensure no repeated entries on the accounts to be returned (connected and all)
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
                        $in: ["$$this.accountNumber", "$$value"],
                      },
                      [],
                      ["$$this.accountNumber"],
                    ],
                  },
                ],
              },
            },
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
                        $in: ["$$this", "$$value"],
                      },
                      [],
                      ["$$this"],
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      // This projects the data to be returned from the querry
      {
        $project: {
          _id: 0,
          institution: {
            identifier: "$_id.identifier",
            name: "$_id.name",
            icon: "$_id.icon",
            bankCode: "$_id.bankCode",
            type: "$_id.type",
            primaryColor: "$_id.primaryColor",
          },
          allAccounts: {
            $filter: {
              input: "$All accounts numbers",
              as: "account",
              cond: { $ne: ["$$account", null] },
            },
          },
          connectedAcounts: {
            $filter: {
              input: "$Accounts connected",
              as: "account",
              cond: { $ne: ["$$account", null] },
            },
          },
        },
      },
      {
        $sort: { updated_at: -1 },
      },
    ]).exec();
  }

  public async toggleAccount(
    accountNumbers: string,
    bvn: string,
    link: boolean
  ): Promise<{ error: boolean; message: string; data? }> {
    const state = link ? "linked" : "unlinked";

    if (accountNumbers === "all") {
      const update = await Account.updateMany(
        { bvn: { $regex: `${bvn}` } },
        { linked: link }
      ).exec();
      return {
        error: false,
        message: `All Accounts ${state} successfully`,
        data: update,
      };
    }

    const account = await Account.find({
      accountNumber: accountNumbers,
      bvn: { $regex: `${bvn}` },
    }).exec();

    if (account === null) {
      return { error: true, message: `Account does not exist` };
    }
    
    const update = await Account.updateMany(
      { accountNumber: accountNumbers, bvn: { $regex: `${bvn}$` } },
      { linked: link }
    ).exec();

    return {
      error: false,
      message: `Account ${state} successfully`,
      data: update,
    };
  }
}
