import { Inject } from '@nestjs/common';
import { ConfigStorage } from './config-storage';
import {
  CursorConnectionRequest,
  CursorState,
} from './cursor-connection-request';
import {
  CursorTransformationToken,
  CursorTransformation,
} from './transformation/cursor-transformation.strategy';
import { Types } from 'mongoose';
import { PaginationArgs } from './dto/pagination-args';
import { OFFSET_FIND_NEXT_CURSOR } from './constant';
import { EdgeType, GraphqlConnection } from './connection.factory';
import { PageInfo } from './dto/page-info';

export const CursorConnectionExecutorToken = 'CursorConnectionExecutorToken';

export interface CursorConnectionExecutor {
  buildConnection<Q, T extends PaginationArgs>(
    request: CursorConnectionRequest<Q, T>,
  ): Promise<GraphqlConnection<Q>>;
}

export class CursorConnectionExecutorImpl implements CursorConnectionExecutor {
  private readonly defaultLimit: number;

  constructor(
    @Inject(CursorTransformationToken)
    private readonly cursorTransformation: CursorTransformation<Types.ObjectId>,
    configStorage: ConfigStorage,
  ) {
    this.defaultLimit = configStorage.getDefaultLimit();
  }

  public async buildConnection<Q, T extends PaginationArgs>(
    request: CursorConnectionRequest<Q, T>,
  ) {
    const countQuery = this.createCountQuery(request);

    this.buildCursorQuery(request);

    const [result, count] = await Promise.all([
      request.rootQuery.exec(),
      countQuery,
    ]);

    const edges = this.buildEdges(result, request.cursorKey);

    return this.createConnection(request, edges, count);
  }

  private createCountQuery<Q, T extends PaginationArgs>(
    request: CursorConnectionRequest<Q, T>,
  ) {
    return request.includeCount
      ? request.rootQuery.clone().count().exec()
      : Promise.resolve(undefined);
  }

  private buildCursorQuery<Q, T extends PaginationArgs>(
    request: CursorConnectionRequest<Q, T>,
  ) {
    switch (request.cursorState) {
      case CursorState.DEFAULT:
        break;
      case CursorState.BEFORE:
        if (!request.paginationArguments.before) {
          throw new Error('Missing before cursor');
        }
        request.rootQuery.where({
          [request.cursorKey]: {
            $lt: this.cursorTransformation.parse(
              request.paginationArguments.before,
            ),
          },
        });
        break;
      case CursorState.AFTER:
        if (!request.paginationArguments.after) {
          throw new Error('Missing after cursor');
        }
        request.rootQuery.where({
          [request.cursorKey]: {
            $gt: this.cursorTransformation.parse(
              request.paginationArguments.after,
            ),
          },
        });
        break;
      default:
        throw new Error('Missing Cursor state not supported');
    }
    request.rootQuery.limit(
      (request.limit ?? this.defaultLimit) + OFFSET_FIND_NEXT_CURSOR,
    );
  }

  private buildEdges<Q>(result: Q[], cursorKey: string): EdgeType<Q>[] {
    return result.map((item) => ({
      cursor: this.cursorTransformation.transform(item[cursorKey]),
      node: item,
    }));
  }

  private createConnection<Q, A extends PaginationArgs>(
    request: CursorConnectionRequest<Q, A>,
    edges: EdgeType<Q>[],
    count: number | undefined,
  ): GraphqlConnection<Q> {
    const pageInfo = new PageInfo();
    const limitFindCursor =
      (request.limit ?? this.defaultLimit) + OFFSET_FIND_NEXT_CURSOR;
    const isQueryFull = edges.length === limitFindCursor;

    switch (request.cursorState) {
      case CursorState.DEFAULT:
        pageInfo.hasPreviousPage = false;
        pageInfo.hasNextPage = isQueryFull;
        break;
      case CursorState.BEFORE:
        pageInfo.hasPreviousPage = isQueryFull;
        pageInfo.hasNextPage = edges.length > 0;
        break;
      case CursorState.AFTER:
        pageInfo.hasNextPage = isQueryFull;
        pageInfo.hasPreviousPage = edges.length > 0;
        break;
      default:
        throw new Error('Missing Cursor state not supported');
    }

    if (isQueryFull) {
      edges.pop();
    }

    pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null;
    pageInfo.endCursor =
      edges.length > 0 ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo,
      totalCount: count,
    };
  }
}
