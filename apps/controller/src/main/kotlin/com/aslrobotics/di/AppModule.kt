package com.aslrobotics.di

import com.aslrobotics.db.DatabaseFactory
import com.aslrobotics.services.GameService
import com.aslrobotics.services.TBAService
import com.aslrobotics.services.TeamService
import org.koin.dsl.module

val appModule = module {
    single { DatabaseFactory() }
    single { TeamService(get<DatabaseFactory>().db) }
    single { GameService(get<DatabaseFactory>().db) }
    single { TBAService(System.getenv("X-TBA-Auth-Key")) }
}
