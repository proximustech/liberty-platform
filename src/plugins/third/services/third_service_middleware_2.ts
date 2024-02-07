export class ThirdMiddleware_2 {
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
            param = param + " and modified :-) "
            console.log('final param : ' + param);
            return next(param);
          }
    }
}