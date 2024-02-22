// @ts-ignore
import {MiddlewareManager} from 'js-middleware';

//Targets
let middlewareTargets = {}
//BaseManagers
let middlewareBaseManagers = {}

//////++++++ Target Definition START ///////
let middlewareServiceName = "thirdService"
import {Third} from "../plugins/middleware_target/services/third_service"
// @ts-ignore
middlewareTargets[middlewareServiceName]=new Third()


///+++ Base Definition START ///
// @ts-ignore
middlewareBaseManagers[middlewareServiceName] = new MiddlewareManager(middlewareTargets[middlewareServiceName])
import {ThirdMiddleware_1} from "../plugins/middleware_base/middleware/middleware_base_middleware"
// @ts-ignore
middlewareBaseManagers[middlewareServiceName].use(new(ThirdMiddleware_1))
///--- Base Definition END ///



//////------ Target Definition END ///////


export let exposedMiddlewareTargets = middlewareTargets