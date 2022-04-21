import { Inject } from '@nestjs/common';
import { PaginationArgs } from '@pagination/dto/pagination-args';
import { isEmpty } from 'lodash';
import { Query, Types } from 'mongoose';
import { ConfigStorage } from './config-storage';
import { EdgeType, GraphqlConnection } from './connection.factory';
import { OFFSET_FIND_NEXT_CURSOR } from './constant';
import { PageInfo } from './dto/page-info';
import {
  CursorTransformation,
  CursorTransformationToken,
} from './transformation/cursor-transformation.strategy';

// type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type MapperConnectionInput<T, A extends PaginationArgs> = {
  edges: EdgeType<T>[];
  paginationArgs: A;
  totalCount?: number;
};

export const CursorPaginationBuilderToken = 'CursorPaginationBuilderToken';

export interface CursorPaginationQueryBuilder {
  build<Q, T extends PaginationArgs>(
    query: Query<Q[], Q>,
    paginationArgs: T,
  ): Query<Q[], Q>;
  buildEdges<Q>(result: Q[]): EdgeType<Q>[];
  buildConnection<Q, T extends PaginationArgs>(
    input: MapperConnectionInput<Q, T>,
  ): GraphqlConnection<Q>;
}

export class CursorPaginationQueryBuilderImpl
  implements CursorPaginationQueryBuilder
{
  private defaultLimit: number;
  private cursorKey: string;

  constructor(
    @Inject(CursorTransformationToken)
    private readonly cursorTransformation: CursorTransformation<Types.ObjectId>,
    configStorage: ConfigStorage,
  ) {
    this.defaultLimit = configStorage.getDefaultLimit();
    this.cursorKey = '_id';
  }

  build<Q, T extends PaginationArgs>(
    query: Query<Q[], Q>,
    paginationArgs: T,
  ): Query<Q[], Q> {
    let limit: number = this.defaultLimit + OFFSET_FIND_NEXT_CURSOR;
    if (isEmpty(paginationArgs)) {
      query.limit(limit);
      return query;
    }
    if (paginationArgs.after) {
      query.where({
        [this.cursorKey]: {
          $gt: this.cursorTransformation.parse(paginationArgs.after),
        },
      });
      if (paginationArgs.first) {
        limit = paginationArgs.first + OFFSET_FIND_NEXT_CURSOR;
      }
    } else if (paginationArgs.before) {
      query.where({
        [this.cursorKey]: {
          $lt: this.cursorTransformation.parse(paginationArgs.before),
        },
      });
      if (paginationArgs.last) {
        limit = paginationArgs.last + OFFSET_FIND_NEXT_CURSOR;
      }
    }
    query.limit(limit);
    return query;
  }

  buildEdges<Q>(result: Q[]): EdgeType<Q>[] {
    return result.map((item) => ({
      cursor: this.cursorTransformation.transform(item[this.cursorKey]),
      node: item,
    }));
  }

  buildConnection<T, A extends PaginationArgs>(
    input: MapperConnectionInput<T, A>,
  ): GraphqlConnection<T> {
    const defaultLimit = this.defaultLimit;
    const pageInfo = new PageInfo();
    const { edges, paginationArgs, totalCount } = input;
    let canContinue = false;

    pageInfo.hasPreviousPage = false;
    pageInfo.hasNextPage = edges.length - 1 === defaultLimit;

    if (pageInfo.hasNextPage) {
      canContinue = true;
    }

    if (paginationArgs.first && !paginationArgs.after) {
      pageInfo.hasNextPage = paginationArgs.first < edges.length;
      canContinue = pageInfo.hasNextPage;
    }

    if (paginationArgs.last && !paginationArgs.before) {
      pageInfo.hasPreviousPage = paginationArgs.last < edges.length;
      canContinue = pageInfo.hasPreviousPage;
    }

    if (paginationArgs.after) {
      pageInfo.hasPreviousPage = edges.length > 0;
      pageInfo.hasNextPage =
        edges.length - 1 === (paginationArgs.first ?? defaultLimit);

      if (pageInfo.hasNextPage) {
        canContinue = true;
      }
    } else if (paginationArgs.before) {
      pageInfo.hasPreviousPage =
        edges.length - 1 === (paginationArgs.last ?? defaultLimit);
      pageInfo.hasNextPage = edges.length > 0;
      if (pageInfo.hasPreviousPage) {
        canContinue = true;
      }
    }

    if (canContinue) {
      edges.pop();
    }

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
