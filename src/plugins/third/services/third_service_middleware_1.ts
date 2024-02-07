export class ThirdMiddleware_1 {
    middlewareMethods: string[];

    constructor() {
        /**
         * Or Define function names for middleweare target.
         * @type {Array}
         */
        this.middlewareMethods = ['thirdMethod'];
      }

    thirdMethod(target:any){
        // @ts-ignore
        return next => param => {
            console.log('initial param : ' + param);
            param = param + " changed "
            console.log('final param : ' + param);
            return next(param);
          }
    }
}