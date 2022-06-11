package com.aslrobotics.models

import org.bson.codecs.pojo.annotations.BsonId
import org.litote.kmongo.Id

data class Team(
    @BsonId val id: Id<Team>? = null,
    val number: Int,
    val name: String,
    val weight: Double,
    // whatever else
)