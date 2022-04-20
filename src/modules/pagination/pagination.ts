import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfo } from './page-info';

export interface GraphqlConnection<T> {
  edges: {
    cursor: string;

    node: T;
  }[];

  pageInfo: PageInfo;

  totalCount: number;
}
/**
 * Based on https://docs.nestjs.com/graphql/resolvers#generics
 *
 * @param classRef
 */
export function createConnection<T>(
  classRef: Type<T>,
): Type<GraphqlConnection<T>> {
  @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    @Field(() => Number, { nullable: true })
    totalCount: number;
  }
  return PaginatedType as Type<GraphqlConnection<T>>;
}
