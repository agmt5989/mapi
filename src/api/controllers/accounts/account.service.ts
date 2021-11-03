import Account from '../../models/account';

export class AccountService {
  constructor() {}

  public async getAccounts(customerId: string) {
    return await Account.aggregate([
      {
        $match: {
          customer: customerId,
        },
      },
      {
        $sort: { updated_at: -1 },
      },
      {
        $lookup: {
          from: 'institutions',
          localField: 'institution',
          foreignField: '_id',
          as: 'institution',
        },
      },
      { $unwind: '$institution' },
      {
        $group: {
          _id: '$accountNumber',
          id: { $first: '$_id' },
          accountNumber: { $first: '$accountNumber' },
          name: { $first: '$name' },
          balance: { $first: '$balance' },
          currency: { $first: '$currency' },
          bvn: { $first: '$bvn' },
          linked: { $first: '$linked' },
          type: { $first: '$type' },
          institution: { $first: '$institution' },
          updated_at: { $first: '$updated_at' },
          created_at: { $first: '$created_at' },
        },
      },
      {
        $sort: { updated_at: -1 },
      },
    ]);

  }
}