package com.aslrobotics.models

import com.fasterxml.jackson.annotation.JsonFormat
import org.bson.codecs.pojo.annotations.BsonId
import org.litote.kmongo.Id
import java.util.*

data class Game(
    @BsonId val id: Id<Game>? = null,
    val time: Date,
    val type: GameType,
    val number: Int,
    val records: List<GameRecord>
)

data class GameRecord(val teamNumber: Int, val data: List<String>, val station: Station)
data class GameDataDTO(val data: String)

@JsonFormat(shape = JsonFormat.Shape.STRING)
enum class GameType {
    PRACTICE, QUALIFIER, PLAYOFF;

    override fun toString(): String {
        return when (this) {
            PRACTICE -> "PRACTICE"
            QUALIFIER -> "QUALIFICATION"
            PLAYOFF -> "PLAYOFF"
        }
    }

    companion object {
        fun parse(str: String?) = when (str) {
            "PRACTICE" -> PRACTICE
            "QUALIFICATION" -> QUALIFIER
            "PLAYOFF" -> PLAYOFF
            else -> null
        }
    }
}

@JsonFormat(shape = JsonFormat.Shape.STRING)
enum class Station {
    RED_1, RED_2, RED_3, BLUE_1, BLUE_2, BLUE_3;
}