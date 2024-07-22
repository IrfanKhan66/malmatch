type ErrorCode = "S_ERR" | "E_ERR";

export class ElementError extends Error {
  code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}
