import { Injectable } from '@nestjs/common';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { Model, Types } from 'mongoose';
import { GraphqlConnection } from './connection.factory';
import { PageInfo } from './dto/page-info';
import { PaginationContainer } from './pagination.container';
import { CursorTransformation } from './transformation/cursor-transformation';

// TODO: Separate this code to be reuseable
@Injectable()
export class QueryCompiler {
  constructor(private readonly cursorTransformation: CursorTransformation) {}

  async compile<M, T extends PaginationArgs>(
    model: Model<M>,
    paginationArgs: T,
  ): Promise<GraphqlConnection<M>> {
    const configStorage = PaginationContainer.getConfigStore();

    const query = model.find().lean();
    const countQuery = query.clone();

    let limitToFindNextCursor: number = configStorage.getDefaultLimit();

    if (paginationArgs.first) {
      if (paginationArgs.after) {
        const offsetId = new Types.ObjectId(
          this.cursorTransformation.parse(paginationArgs.after),
        );
        query.where({ _id: { $gt: offsetId } });
      }

      if (paginationArgs.first) {
        limitToFindNextCursor = paginationArgs.first + 1;
      }

      query.limit(limitToFindNextCursor);
    } else if (paginationArgs.last && paginationArgs.before) {
      const offsetId = new Types.ObjectId(
        this.cursorTransformation.parse(paginationArgs.before),
      );

      if (paginationArgs.last) {
        limitToFindNextCursor = paginationArgs.last + 1;
      }

      query.where({ _id: { $lt: offsetId } }).limit(limitToFindNextCursor);
    }

    const result = await query.exec();
    const edges = result.map((item) => ({
      cursor: this.cursorTransformation.transform(item._id.toString()),
      node: item,
    }));
    const totalCount = await countQuery.count();
    const pageInfo = new PageInfo();

    pageInfo.hasNextPage = edges.length === limitToFindNextCursor;
    pageInfo.hasPreviousPage = !!paginationArgs.after; // TODO: Need to verify the previous data of the cursor when edges length = 0
    pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null;
    pageInfo.endCursor =
      edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo,
      totalCount,
    };
  }
}
