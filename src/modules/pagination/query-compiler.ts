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
  // if (!(paginationArgs instanceof PaginationArgs)) {
  //   throw new Error('paginationArgs must be instance of PaginationArgs');
  // }
  const cursorGenerator = new CursorGenerator();
  const query = model.find().lean();
  const countQuery = query.clone();

  if (paginationArgs.first) {
    if (paginationArgs.after) {
      const offsetId = new Types.ObjectId(
        cursorGenerator.parse(paginationArgs.after),
      );
      query.where({ _id: { $gt: offsetId } });
    }

    const limit = paginationArgs.first ?? configStorage.getDefaultLimit();
    query.limit(limit);
  } else if (paginationArgs.last && paginationArgs.before) {
    const offsetId = new Types.ObjectId(
      cursorGenerator.parse(paginationArgs.before),
    );

    const limit = paginationArgs.last ?? configStorage.getDefaultLimit();

    query.where({ _id: { $lt: offsetId } }).limit(limit);
  }

  const result = await query;
  const edges = result.map((item) => ({
    cursor: cursorGenerator.generate(item._id.toString()),
    node: item,
  }));
  const totalCount = await countQuery.count();
  const pageInfo = new PageInfo();

  pageInfo.hasNextPage = true;
  pageInfo.hasNextPage = false;
  pageInfo.endCursor = '';
  pageInfo.startCursor = '';

  return {
    edges,
    pageInfo,
    totalCount,
  };
}
