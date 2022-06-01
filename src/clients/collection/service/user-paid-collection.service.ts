export const UserPaidCollectionServiceToken = 'UserPaidCollectionService';

export interface UserPaidCollectionService {
  buyCollectionByUser(
    providerCollectionId: string,
    userId: string,
  ): Promise<void>;
}
