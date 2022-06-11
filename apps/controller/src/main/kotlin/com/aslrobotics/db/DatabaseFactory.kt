package com.aslrobotics.db

import org.litote.kmongo.coroutine.coroutine
import org.litote.kmongo.reactivestreams.KMongo

class DatabaseFactory {
    val db = run {
        val client = KMongo.createClient().coroutine
        client.getDatabase("scouting-app")
    }
}