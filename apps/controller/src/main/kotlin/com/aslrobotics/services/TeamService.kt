package com.aslrobotics.services

import com.aslrobotics.models.Team
import org.litote.kmongo.coroutine.CoroutineDatabase
import org.litote.kmongo.eq

class TeamService(private val db: CoroutineDatabase) {

    private val col
        get() = db.getCollection<Team>()

    suspend fun findByNumber(number: Int) = col.findOne(Team::number eq number)
    suspend fun findByName(name: String) = col.findOne(Team::name eq name)
    suspend fun findAll() = col.find().toList()
    suspend fun insertOne(team: Team) = col.insertOne(team)
    suspend fun updateByNumber(number: Int, team: Team) =
        col.updateOne(Team::number eq number, team, updateOnlyNotNullProperties = true)
    suspend fun deleteByNumber(number: Int) = col.deleteOne(Team::number eq number)

    fun parseNumber(number: String?) = number?.toIntOrNull()
}