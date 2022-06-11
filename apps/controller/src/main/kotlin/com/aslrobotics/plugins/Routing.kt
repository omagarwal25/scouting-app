package com.aslrobotics.plugins

import com.aslrobotics.routes.gameRouting
import com.aslrobotics.routes.teamRouting
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        teamRouting()
        gameRouting()
    }
}
