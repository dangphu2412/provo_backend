import { BadRequestException } from '@nestjs/common';
import { Query } from 'mongoose';
import { PaginationArgs } from './dto/pagination-args';

export interface QueryRequest<Q, A extends PaginationArgs> {
  query: Query<Q[], Q>;
  paginationArguments: A;
  includeCount?: boolean;
}

export enum CursorState {
  DEFAULT,
  BEFORE,
  AFTER,
}

export interface CursorConnectionRequest<Q, A extends PaginationArgs> {
  readonly cursorKey: string;
  rootQuery: Query<Q[], Q>;
  includeCount: boolean;
  paginationArguments: A;
  cursorState: CursorState;
  limit?: number;
}

export class CursorConnectionRequestBuilder<
  Q,
  A extends PaginationArgs = PaginationArgs,
> implements CursorConnectionRequest<Q, A>
{
  public readonly cursorKey: string;
  public rootQuery: Query<Q[], Q>;
  public includeCount: boolean;
  public paginationArguments: A;
  public cursorState: CursorState;
  public limit?: number;

  constructor(queryRequest: QueryRequest<Q, A>) {
    this.cursorKey = '_id';
    this.rootQuery = queryRequest.query;
    this.includeCount = queryRequest.includeCount ?? true;
    this.paginationArguments = queryRequest.paginationArguments;
    this.setupCursorStateAndLimit();
  }

  private setupCursorStateAndLimit() {
    if (this.paginationArguments.before) {
      this.cursorState = CursorState.BEFORE;
      if (this.paginationArguments.last) {
        this.limit = this.paginationArguments.last;
      }
      if (this.paginationArguments.first) {
        throw new BadRequestException('Cannot use first and before together');
      }
    } else if (this.paginationArguments.after) {
      this.cursorState = CursorState.AFTER;
      if (this.paginationArguments.first) {
        this.limit = this.paginationArguments.first;
      }
      if (this.paginationArguments.last) {
        throw new BadRequestException('Cannot use last and after together');
      }
    } else {
      this.cursorState = CursorState.DEFAULT;
      if (this.paginationArguments.first) {
        this.limit = this.paginationArguments.first;
      }
    }
  }
}
