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