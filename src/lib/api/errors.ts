import { NextResponse } from "next/server";

/**
 * API error types
 */
export type ApiErrorType =
  | "validation"
  | "auth"
  | "not_found"
  | "server"
  | "configuration"
  | "rate_limit"
  | "external_api";

/**
 * Custom API error class with type information
 */
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode: number;

  constructor(type: ApiErrorType, message: string) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = getStatusCodeForErrorType(type);
  }
}

/**
 * Maps error types to HTTP status codes
 */
function getStatusCodeForErrorType(type: ApiErrorType): number {
  switch (type) {
    case "validation":
      return 400;
    case "auth":
      return 401;
    case "not_found":
      return 404;
    case "rate_limit":
      return 429;
    case "configuration":
      return 500;
    case "external_api":
      return 502;
    case "server":
    default:
      return 500;
  }
}

/**
 * Creates an API error with the specified type and message
 */
export function createApiError(type: ApiErrorType, message: string): ApiError {
  return new ApiError(type, message);
}

/**
 * Creates a NextResponse with error information
 */
export function createErrorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        type: error.type,
      },
      { status: error.statusCode }
    );
  }

  console.error("Unhandled API error:", error);

  // Handle unexpected errors
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return NextResponse.json(
    {
      error: message,
      type: "server",
    },
    { status: 500 }
  );
}
