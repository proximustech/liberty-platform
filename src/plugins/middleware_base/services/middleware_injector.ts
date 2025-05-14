import {ThirdMiddleware_1} from "../services/third_service_middleware_1"

let middlewareInjector:any = {}
middlewareInjector.inject = (middlewareManager:any) => {
    
    middlewareManager.use(new(ThirdMiddleware_1))

}

export default middlewareInjector