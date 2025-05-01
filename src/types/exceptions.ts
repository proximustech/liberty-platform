export class ExceptionNotAuthorized extends Error {

    public static notAuthorized: string = "Not Authorized";
  
    constructor(message: string) {
      super(message);
      this.name = "NotAuthorized";
      this.stack = (<any> new Error()).stack;
    }
  
}

export class ExceptionRecordAlreadyExists extends Error {

  public static recordAlreadyExists: string = "Record Already Exists";

  constructor(message: string) {
    super(message);
    this.name = "RecordAlreadyExists";
    this.stack = (<any> new Error()).stack;
  }

}

export class ExceptionInvalidObject extends Error {

  public static invalidObject: string = "Invalid Object";
  public errorMessages:any

  constructor(message: string, errorMessages:any) {
    super(message);
    this.name = "InvalidObject";
    this.errorMessages = errorMessages
    this.stack = (<any> new Error()).stack;
  }

}

export class ExceptionDataBaseUnExpectedResult extends Error {

  public static databaseUnexpectedResult: string = "Database Unexpected Result";

  constructor(message: string) {
    super(message);
    this.name = "DatabaseUnexpectedResult";
    this.stack = (<any> new Error()).stack;
  }

}
export class ExceptionCsrfTokenFailed extends Error {

  public static ExceptionCsrfTokenFailed: string = "Csrf Token Failed";

  constructor(message: string) {
    super(message);
    this.name = "ExceptionCsrfTokenFailed";
    this.stack = (<any> new Error()).stack;
  }

}

export class ExceptionSessionInvalid extends Error {

  public static exceptionSessionInvalid: string = "Session Invalid";

  constructor(message: string) {
    super(message);
    this.name = "ExceptionSessionInvalid";
    this.stack = (<any> new Error()).stack;
  }

}