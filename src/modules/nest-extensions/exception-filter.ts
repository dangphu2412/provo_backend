import { GraphQLError, GraphQLFormattedError } from 'graphql';

export type ErrorHandler = string | ((...args: any[]) => string);

/**
 * @description This is a custom error filter that is used to handle errors
 */
export class ExceptionHandler {
  private errorKeyByMessageHandler = new Map<string, ErrorHandler>();

  constructor(errorHandlerKeyByCode: Record<string, ErrorHandler>) {
    Object.keys(errorHandlerKeyByCode).forEach((key) => {
      this.errorKeyByMessageHandler.set(key, errorHandlerKeyByCode[key]);
    });
  }

  public handle(error: GraphQLError): GraphQLFormattedError {
    const { originalError } = error;
    console.log(error);

    if (originalError) {
      return {
        ...error,
        message: originalError.message,
        locations: error.locations,
        path: error.path,
      };
    }
    return error;
  }
}
