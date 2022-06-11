package com.aslrobotics.services

import com.aslrobotics.models.Game
import com.aslrobotics.models.GameRecord
import com.aslrobotics.models.GameType
import org.litote.kmongo.*
import org.litote.kmongo.coroutine.CoroutineDatabase

class GameService(private val db: CoroutineDatabase) {
    private val col
        get() = db.getCollection<Game>()

    suspend fun findAll(): List<Game> = col.find().toList()
    suspend fun findOne(type: GameType, number: Int) = col.findOne(filter(type, number))
    suspend fun insertOne(game: Game) = col.insertOne(game)
    suspend fun updateOne(type: GameType, number: Int, game: Game, ignoreNull: Boolean) =
        col.updateOne(filter(type, number), game, updateOnlyNotNullProperties = ignoreNull)

    suspend fun deleteOne(type: GameType, number: Int) = col.deleteOne(filter(type, number))

    suspend fun addRecord(type: GameType, number: Int, record: GameRecord) =
        col.updateOne(filter(type, number), push(Game::records, record))

    suspend fun addData(type: GameType, number: Int, teamNumber: Int, data: String) =
        col.updateOne(
            and(filter(type, number), (Game::records / GameRecord::teamNumber eq teamNumber)),
            push(Game::records.posOp / GameRecord::data, data)
        )

    suspend fun findGamesByTeam(teamNumber: Int): List<Game> = col.find(Game::records / GameRecord::teamNumber eq teamNumber).toList()
    suspend fun deleteAll() = col.deleteMany()

    fun filter(type: GameType, number: Int) = and(Game::type eq type, Game::number eq number)

}