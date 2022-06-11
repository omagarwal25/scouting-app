package com.aslrobotics.services

import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class TBAService(val key: String): KoinComponent {
    val teamService: TeamService by inject()


}