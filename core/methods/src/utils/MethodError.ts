export interface MethodError extends Error {
  message: string;
  code: number;
}

export class UniquePrimaryKeyError extends Error implements MethodError {
  message = 'The primary key already exists in the database.';
  code = -2010290;
}
