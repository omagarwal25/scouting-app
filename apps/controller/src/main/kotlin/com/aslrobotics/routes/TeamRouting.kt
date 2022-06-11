package com.aslrobotics.routes

import com.aslrobotics.models.Team
import com.aslrobotics.services.TeamService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.teamRouting() {
    val teamService by inject<TeamService>()

    route("teams") {
        get {
            val number = call.request.queryParameters["number"]
            val name = call.request.queryParameters["name"]

            if (number != null) {
                val parsed = number.toIntOrNull() ?: return@get call.respondText(
                    "Invalid Team Number",
                    status = HttpStatusCode.BadRequest
                )

                val team = teamService.findByNumber(parsed) ?: return@get call.respondText(
                    "Team Not Found",
                    status = HttpStatusCode.NotFound
                )

                return@get call.respond(team)
            } else if (name != null) {
                val team = teamService.findByName(name) ?: return@get call.respondText(
                    "Team Not Found",
                    status = HttpStatusCode.NotFound
                )

                return@get call.respond(team)
            } else {
                return@get call.respond(teamService.findAll())
            }
        }

        get("{number}") {
            val number = teamService.parseNumber(call.parameters["number"]) ?: return@get call.respondText(
                "Invalid Team Number",
                status = HttpStatusCode.BadRequest
            )

            val team = teamService.findByNumber(number) ?: return@get call.respondText(
                "Team Not Found",
                status = HttpStatusCode.NotFound
            )

            return@get call.respond(team)
        }

        post {
            val team = call.receive<Team>()
            teamService.insertOne(team)
            call.respondText("Team added successfully", status = HttpStatusCode.Created)
        }

        patch("{number}") {
            val team = call.receive<Team>()

            val number =
                call.parameters["number"]?.toIntOrNull() ?: return@patch call.respondText(
                    "Missing Id",
                    status = HttpStatusCode.BadRequest
                )

            // check if team exists
            teamService.findByNumber(number) ?: return@patch call.respondText(
                "No Team with id $number",
                status = HttpStatusCode.NotFound
            )

            teamService.updateByNumber(number, team)
            call.respondText("Team updated successfully", status = HttpStatusCode.OK)
        }

        delete("{number}") {
            val number =
                call.parameters["number"]?.toIntOrNull() ?: return@delete call.respondText(
                    "Missing Id",
                    status = HttpStatusCode.BadRequest
                )

            teamService.deleteByNumber(number)
            call.respondText("Team deleted successfully", status = HttpStatusCode.OK)
        }
    }
}