import { NextResponse } from "next/server";

/**
 * Error types for the API using a functional discriminated union approach
 */
export type ApiErrorType = "validation" | "configuration" | "general";

export interface ApiErrorInfo {
  type: ApiErrorType;
  message: string;
  status: number;
}

export type ErrorResponse = {
  error: string;
};

/**
 * Creates an API error with appropriate status code and type
 */
export const createApiError = (
  type: ApiErrorType,
  message: string,
  status?: number
): ApiErrorInfo => {
  switch (type) {
    case "validation":
      return { type, message, status: status ?? 400 };
    case "configuration":
      return { type, message, status: status ?? 500 };
    default:
      return { type, message, status: status ?? 500 };
  }
};

/**
 * Creates an appropriate NextResponse based on the error
 */
export const createErrorResponse = (
  error: unknown
): NextResponse<ErrorResponse> => {
  console.error("Error in API:", error);

  if (
    error &&
    typeof error === "object" &&
    "type" in error &&
    "status" in error &&
    "message" in error
  ) {
    const apiError = error as ApiErrorInfo;
    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.status }
    );
  }

  return NextResponse.json(
    { error: "Failed to process request" },
    { status: 500 }
  );
};
