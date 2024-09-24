export interface MethodError extends Error {
  message: string;
  code: number;
}

export class UniquePrimaryKeyError extends Error implements MethodError {
  message = 'The primary key already exists in the database.';
  code = -2010290;
}


export class ProtectError extends Error implements MethodError {
  message = 'Mechanism Protect Error.';
  code = -2010291;

  constructor(message?: string) {
    super(message);
    if (typeof message === 'string') {
      this.message = message;
    }
  }
}

export class ParamsError extends Error implements MethodError {
  message = 'Method params are invalid.';
  code = -2010292;

  constructor(message?: string) {
    super(message);
    if (typeof message === 'string') {
      this.message = message;
    }
  }
}

export class NoDocumentError extends Error implements MethodError {
  message = 'No document found in the database.';
  code = -2010293;

  constructor(message?: string) {
    super(message);
    if (typeof message === 'string') {
      this.message = message;
    }
  }
}

export class UnknowError extends Error implements MethodError {
  message = 'Unknow error';
  code = -2010294;

  constructor(message?: string) {
    super(message);
    if (typeof message === 'string') {
      this.message = message;
    }
  }
}