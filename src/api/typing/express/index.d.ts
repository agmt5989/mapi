declare namespace Express {
  interface Response {
    ok: (data?: any, cache?: boolean) => Response | undefined;
    forbidden: (data?: any) => Response;
  }
  interface Request {
    user?: any;
  }
}
