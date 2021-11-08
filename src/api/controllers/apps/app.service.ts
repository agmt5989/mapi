import Account, { IAccount } from "../../models/account";

export class AppService {
  constructor() {}
  /**
   *
   * @param bvn unique bvn of the customer
   * @returns {[ app : {}, connectedAccounts: [], allaccounts: [] ]}
   */
  public async getApps(bvn: string) {
    return await Account.aggregate([
      // match by the bvn of the customer
      {
        $match: {
          bvn: { $regex: bvn },
        },
      },
      // looks up by app id to get the complete object returned
      {
        $lookup: {
          from: "apps",
          localField: "app",
          foreignField: "_id",
          as: "app",
        },
      },
      { $unwind: "$app" },
      // Groups entries that match bvn query by the app
      {
        $group: {
          _id: "$app",
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
      // This adds field to ensure no repeated entries on the apps to be returned (connected and all)
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
          app: {
            icon: "$_id.icon",
            live: "$_id.live",
            name: "$_id.name",
            displayName: "$_id.displayName",
            product: "$_id.product",
            industry: "$_id.industry",
            scopes: "$_id.scopes",
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

  public async toggleApps(
    apps: string,
    bvn: string,
    link: boolean
  ): Promise<{ error: boolean; message: string; data? }> {
    const state = link ? "linked" : "unlinked";

    if (apps === "all") {
      // @ts-ignore
      const update = await Account.updateMany(
        { bvn: { $regex: `${bvn}` } },
        { linked: link }
      ).exec();
      return {
        error: false,
        message: `All App ${state} successfully`,
        data: update,
      };
    }

    // @ts-ignore
    const account = await Account.find({
      app: apps,
      bvn: { $regex: `${bvn}` },
    }).exec();
    if (account === null) return { error: true, message: `App does not exist` };

    const update = await Account.updateMany(
      // @ts-ignore
      { app: apps, bvn: { $regex: `${bvn}` } },
      { linked: link }
    ).exec();

    return { error: false, message: `App ${state} successfully`, data: update };
  }
}
