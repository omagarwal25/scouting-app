package com.aslrobotics.plugins

import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.litote.kmongo.id.jackson.IdJacksonModule

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        jackson() {
            registerModule(IdJacksonModule())
        }
    }

    routing {
        get("/json/kotlinx-serialization") {
            call.respond(mapOf("hello" to "world"))
        }
    }
}
