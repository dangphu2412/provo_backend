import { PaginationContainer } from './pagination.container';
import { PaginationArgs } from '@pagination/pagination-args';
import { Model, Types } from 'mongoose';
import { CursorGenerator } from './cursor';
import { GraphqlConnection } from './pagination';
import { PageInfo } from './page-info';

const configStorage = PaginationContainer.getConfigStore();

export async function compile<M, T extends PaginationArgs>(
  model: Model<M>,
  paginationArgs: T,
): Promise<GraphqlConnection<M>> {
  const cursorGenerator = new CursorGenerator();

  const query = model.find().lean();
  const countQuery = query.clone();

  let limitToFindNextCursor: number;

  if (paginationArgs.first) {
    if (paginationArgs.after) {
      const offsetId = new Types.ObjectId(
        cursorGenerator.parse(paginationArgs.after),
      );
      query.where({ _id: { $gt: offsetId } });
    }

    const limit = paginationArgs.first ?? configStorage.getDefaultLimit();
    limitToFindNextCursor = limit + 1;
    query.limit(limitToFindNextCursor);
  } else if (paginationArgs.last && paginationArgs.before) {
    const offsetId = new Types.ObjectId(
      cursorGenerator.parse(paginationArgs.before),
    );

    const limit = paginationArgs.last ?? configStorage.getDefaultLimit();
    limitToFindNextCursor = limit + 1;
    query.where({ _id: { $lt: offsetId } }).limit(limitToFindNextCursor);
  }

  const result = await query;
  const edges = result.map((item) => ({
    cursor: cursorGenerator.generate(item._id.toString()),
    node: item,
  }));
  const totalCount = await countQuery.count();
  const pageInfo = new PageInfo();

  pageInfo.hasNextPage = edges.length === limitToFindNextCursor;
  pageInfo.hasPreviousPage = !!paginationArgs.after; // TODO: Need to verify the previous data of the cursor when edges length = 0
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null;
  pageInfo.endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;

  return {
    edges,
    pageInfo,
    totalCount,
  };
}
