import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfo } from './page-info';

export interface EdgeType<T> {
  cursor: string;
  node: T;
}
export interface GraphqlConnection<T> {
  edges: EdgeType<T>[];

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
  abstract class AbstractEdgeType implements EdgeType<T> {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class AbstractConnection implements GraphqlConnection<T> {
    @Field(() => [AbstractEdgeType], { nullable: true })
    edges: AbstractEdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    @Field(() => Number, { nullable: true })
    totalCount: number;
  }
  return AbstractConnection as Type<GraphqlConnection<T>>;
}
