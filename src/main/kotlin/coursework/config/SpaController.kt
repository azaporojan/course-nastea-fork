package coursework.config

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

/**
 * Forwards non-API, non-asset routes to index.html so the SPA
 * is served by Spring Boot (frontend build output lives in /static).
 */
@Controller
class SpaController {

    @RequestMapping(value = ["/{path:[^.]*}"])
    fun forward(): String = "forward:/index.html"
}
