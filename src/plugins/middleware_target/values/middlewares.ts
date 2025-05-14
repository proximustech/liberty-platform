// @ts-ignore
import {MiddlewareManager} from 'js-middleware';
import { registeredPlugins } from "../values/registered_middleware_plugins";

let middlewareTargets:any = {}
let middlewareBaseManagers:any = {}

//Exposing a service in the middlewareTargets variable
let middlewareServiceName = "thirdService"
import {Third} from "../services/third_service"
middlewareTargets[middlewareServiceName]=new Third()
//Put the exposed service inside the MiddlewareManager
middlewareBaseManagers[middlewareServiceName] = new MiddlewareManager(middlewareTargets[middlewareServiceName])
//Inject the exposed service with additional plugins
let pluginMiddlewareInjector = undefined
for (const [pluginMiddlewareServiceName, value] of Object.entries(registeredPlugins)) {

    registeredPlugins[pluginMiddlewareServiceName].forEach((path: string) => {
        pluginMiddlewareInjector = require(path)
        pluginMiddlewareInjector.default.inject(middlewareBaseManagers[pluginMiddlewareServiceName])        
    });

}

export let exposedMiddlewareTargets = middlewareTargets