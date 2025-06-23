export const wrap = (fn: any) =>
    function wrappedFn(req: any, res: any, next: any) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  