package com.aslrobotics.routes

import com.aslrobotics.models.Game
import com.aslrobotics.models.GameDataDTO
import com.aslrobotics.models.GameRecord
import com.aslrobotics.models.GameType
import com.aslrobotics.services.GameService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.gameRouting() {
    val gameService by inject<GameService>()

    route("games") {
        get {
            call.respond(gameService.findAll())
        }

        get("{type}/{number}") {
            val type = GameType.parse(call.parameters["type"]?.lowercase()) ?: return@get call.respondText(
                "Invalid Type Parameter",
                status = HttpStatusCode.BadRequest
            )

            val number = call.parameters["number"]?.toIntOrNull() ?: return@get call.respondText(
                "Invalid Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            val game = gameService.findOne(type, number) ?: return@get call.respondText(
                "Game Not Found",
                status = HttpStatusCode.NotFound
            )

            call.respond(game)
        }

        post {
            val game = call.receive<Game>()
            gameService.insertOne(game)
            call.respond(HttpStatusCode.Created)
        }

        put("{type}/{number}") {
            val type = GameType.parse(
                call.parameters["type"]
            ) ?: return@put call.respondText(
                "Invalid Type Parameter",
                status = HttpStatusCode.BadRequest
            )
            val number = call.parameters["number"]?.toIntOrNull() ?: return@put call.respondText(
                "Invalid Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            val game = call.receive<Game>()
            gameService.updateOne(type, number, game, false)
            call.respond(HttpStatusCode.OK)
        }

        delete {
            gameService.deleteAll()
            call.respond(HttpStatusCode.OK)
        }

        delete("{type}/{number}") {
            val type = GameType.parse(
                call.parameters["type"]
            ) ?: return@delete call.respondText(
                "Invalid Type Parameter",
                status = HttpStatusCode.BadRequest
            )

            val number = call.parameters["number"]?.toIntOrNull() ?: return@delete call.respondText(
                "Invalid Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            gameService.deleteOne(type, number)
            call.respond(HttpStatusCode.OK)
        }

        post("{type}/{number}/record/{teamNumber}") {
            val type = GameType.parse(
                call.parameters["type"]
            ) ?: return@post call.respondText(
                "Invalid Type Parameter",
                status = HttpStatusCode.BadRequest
            )

            val number = call.parameters["number"]?.toIntOrNull() ?: return@post call.respondText(
                "Invalid Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            val teamNumber = call.parameters["teamNumber"]?.toIntOrNull() ?: return@post call.respondText(
                "Invalid Team Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            val (data) = call.receive<GameDataDTO>()

            gameService.findOne(type, number) ?: return@post call.respondText(
                "Game Not Found",
                status = HttpStatusCode.NotFound
            )

            gameService.addData(type, number, teamNumber, data)

            call.respond(HttpStatusCode.OK)
        }

        post("{type}/{number}/record") {
            val type = GameType.parse(
                call.parameters["type"]
            ) ?: return@post call.respondText(
                "Invalid Type Parameter",
                status = HttpStatusCode.BadRequest
            )

            val number = call.parameters["number"]?.toIntOrNull() ?: return@post call.respondText(
                "Invalid Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            gameService.findOne(type, number)
                ?: return@post call.respondText("Game Not Found", status = HttpStatusCode.NotFound)

            val record = call.receive<GameRecord>()
            gameService.addRecord(type, number, record)
            call.respond(HttpStatusCode.OK)
        }

        get("team/{teamNumber}") {
            val teamNumber = call.parameters["teamNumber"]?.toIntOrNull() ?: return@get call.respondText(
                "Invalid Team Number Parameter",
                status = HttpStatusCode.BadRequest
            )

            call.respond(gameService.findGamesByTeam(teamNumber))
        }


    }
}