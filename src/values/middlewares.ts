// @ts-ignore
import {MiddlewareManager} from 'js-middleware';

//Targets
let middlewareTargets = {}
//BaseManagers
let middlewareBaseManagers:any = {}

//////++++++ Target Definition START ///////
let middlewareServiceName = "thirdService"
import {Third} from "../plugins/middleware_target/services/third_service"
// @ts-ignore
middlewareTargets[middlewareServiceName]=new Third()
// @ts-ignore
middlewareBaseManagers[middlewareServiceName] = new MiddlewareManager(middlewareTargets[middlewareServiceName])

let registeredPlugins:any = {
    "thirdService":[
        "../plugins/middleware_base/services/middleware_injector"
    ]
}

let pluginMiddlewareInjector = undefined
for (const [exposedMiddlewareServiceName, value] of Object.entries(registeredPlugins)) {

    registeredPlugins[exposedMiddlewareServiceName].forEach((path: string) => {
        pluginMiddlewareInjector = require(path)
        pluginMiddlewareInjector.default.inject(middlewareBaseManagers[exposedMiddlewareServiceName])        
    });

}


//////------ Target Definition END ///////


export let exposedMiddlewareTargets = middlewareTargets