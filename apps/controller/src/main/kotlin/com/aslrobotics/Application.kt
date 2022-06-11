package com.aslrobotics

import com.aslrobotics.plugins.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

fun main() {
//    val client = KMongo.createClient().coroutine
//    val database = client.getDatabase("scouting-app")

    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureHTTP()
        configureRouting()
        configureSerialization()
        configureMonitoring()
        configureDI()
    }.start(wait = true)


}
