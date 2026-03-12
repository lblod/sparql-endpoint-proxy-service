
export class HttpError extends Error {
  constructor(
    message: string,
    public status?: number,
    public description?: string,
    public object?: object,
  ) {
    super(message);

    if (!this.status) {
      this.status = 500;
    }
    if (!this.description) {
      this.description = null;
    }
  }

  static caughtErrorJsonResponse(error: { message: string; object: any; status: any; description: any; }) {
    const title = error.message ?? 'An unexpected error occurred.';
    const detail = error.object;
    return {
      status: error.status ?? 500,
      title,
      description: error.description,
      detail: detail,
    };
  }
}