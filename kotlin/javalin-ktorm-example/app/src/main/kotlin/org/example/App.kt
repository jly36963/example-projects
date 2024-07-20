@file:Suppress("ktlint:standard:no-wildcard-imports")

package org.example

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.*
import io.javalin.http.Context
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.ktorm.database.*
import org.ktorm.dsl.*
import org.ktorm.schema.*
import org.ktorm.support.postgresql.*
import org.ktorm.support.postgresql.PostgreSqlDialect.*
import java.util.UUID

// ---
// Data classes
// ---

@Serializable
data class Ninja(
    val id: String,
    val firstName: String,
    val lastName: String,
    val age: Int,
    var jutsus: List<Jutsu>? = null,
) {
    fun greet() = println("Hello! My name is $firstName $lastName.")
}

@Serializable
data class NinjaInput(
    val firstName: String,
    val lastName: String,
    val age: Int,
)

@Serializable
data class NinjaUpdates(
    val firstName: String? = null,
    val lastName: String? = null,
    val age: Int? = null,
)

@Serializable
data class Jutsu(
    val id: String,
    val name: String,
    val chakraNature: String,
    val description: String,
)

@Serializable
data class JutsuInput(
    val name: String,
    val chakraNature: String,
    val description: String,
)

@Serializable
data class JutsuUpdates(
    val name: String? = null,
    val chakraNature: String? = null,
    val description: String? = null,
)

// ---
// Utils
// ---

inline fun <reified T> jsonDecodeType(data: String): T {
    val decoder =
        Json {
            ignoreUnknownKeys = true
            encodeDefaults = false
        }
    return decoder.decodeFromString<T>(data)
}

// ---
// Tables
// ---

object Ninjas : Table<Nothing>("ninjas") {
    val id = uuid("id").primaryKey()
    val firstName = varchar("first_name")
    val lastName = varchar("last_name")
    val age = int("age")
}

object Jutsus : Table<Nothing>("jutsus") {
    val id = uuid("id").primaryKey()
    val name = varchar("name")
    val chakraNature = varchar("chakra_nature")
    val description = varchar("description")
}

object NinjasJutsus : Table<Nothing>("ninjas_jutsus") {
    val id = uuid("id").primaryKey()
    val ninjaId = uuid("ninja_id")
    val jutsuId = uuid("jutsu_id")
}

// ---
// DAL
// ---

class PgDal(
    val db: Database,
) {
    fun insertNinja(ninjaInput: NinjaInput): Ninja {
        val id = UUID.randomUUID()
        db.insert(Ninjas) {
            set(it.id, id)
            set(it.firstName, ninjaInput.firstName)
            set(it.lastName, ninjaInput.lastName)
            set(it.age, ninjaInput.age)
        }
        return getNinja(id)
    }

    fun getNinja(id: UUID): Ninja {
        val results =
            db
                .from(Ninjas)
                .select(Ninjas.id, Ninjas.firstName, Ninjas.lastName, Ninjas.age)
                .where { Ninjas.id eq id }
                .map { row ->
                    Ninja(
                        id = row[Ninjas.id].toString(),
                        firstName = row[Ninjas.firstName]!!,
                        lastName = row[Ninjas.lastName]!!,
                        age = row[Ninjas.age]!!,
                        jutsus = null,
                    )
                }
        return results.first()
    }

    fun updateNinja(
        id: UUID,
        updates: NinjaUpdates,
    ): Ninja {
        val (firstName, lastName, age) = updates
        db.update(Ninjas) {
            where {
                it.id eq id
            }
            if (firstName != null) {
                set(it.firstName, firstName)
            }
            if (lastName != null) {
                set(it.lastName, lastName)
            }
            if (age != null) {
                set(it.age, age)
            }
        }
        return getNinja(id)
    }

    fun deleteNinja(id: UUID): Ninja {
        val ninja = getNinja(id)
        db.delete(Ninjas) {
            it.id eq id
        }
        return ninja
    }

    fun insertJutsu(jutsuInput: JutsuInput): Jutsu {
        val id = UUID.randomUUID()

        db.insert(Jutsus) {
            set(it.id, id)
            set(it.name, jutsuInput.name)
            set(it.chakraNature, jutsuInput.chakraNature)
            set(it.description, jutsuInput.description)
        }
        return getJutsu(id)
    }

    fun getJutsu(id: UUID): Jutsu {
        val results =
            db
                .from(Jutsus)
                .select(Jutsus.id, Jutsus.name, Jutsus.chakraNature, Jutsus.description)
                .where { Jutsus.id eq id }
                .map { row ->
                    Jutsu(
                        id = row[Jutsus.id].toString(),
                        name = row[Jutsus.name]!!,
                        chakraNature = row[Jutsus.chakraNature]!!,
                        description = row[Jutsus.description]!!,
                    )
                }
        return results.first()
    }

    fun updateJutsu(
        id: UUID,
        updates: JutsuUpdates,
    ): Jutsu {
        val (name, chakraNature, description) = updates

        db.update(Jutsus) {
            where {
                it.id eq id
            }
            if (name != null) {
                set(it.name, name)
            }
            if (chakraNature != null) {
                set(it.chakraNature, chakraNature)
            }
            if (description != null) {
                set(it.description, description)
            }
        }

        return getJutsu(id)
    }

    fun deleteJutsu(id: UUID): Jutsu {
        val jutsu = getJutsu(id)
        db.delete(Jutsus) {
            it.id eq id
        }
        return jutsu
    }

    fun associateNinjaJutsu(
        ninjaId: UUID,
        jutsuId: UUID,
    ) {
        db.insert(NinjasJutsus) {
            set(it.id, UUID.randomUUID())
            set(it.ninjaId, ninjaId)
            set(it.jutsuId, jutsuId)
        }
    }

    fun dissociateNinjaJutsu(
        ninjaId: UUID,
        jutsuId: UUID,
    ) {
        db.delete(NinjasJutsus) {
            (it.ninjaId eq ninjaId) and (it.jutsuId eq jutsuId)
        }
    }

    private fun getNinjaJutsus(id: UUID): List<Jutsu> {
        // Ktorm doesn't support subqueries, so querying separately
        val jutsuIds =
            db
                .from(NinjasJutsus)
                .select(NinjasJutsus.jutsuId)
                .where { NinjasJutsus.ninjaId eq id }
                .map { row -> row[NinjasJutsus.jutsuId]!! }

        if (jutsuIds.isEmpty()) {
            return listOf<Jutsu>()
        }
        return db
            .from(Jutsus)
            .select(Jutsus.id, Jutsus.name, Jutsus.chakraNature, Jutsus.description)
            .where { Jutsus.id.inList(jutsuIds) }
            .map { row ->
                Jutsu(
                    id = row[Jutsus.id].toString(),
                    name = row[Jutsus.name]!!,
                    chakraNature = row[Jutsus.chakraNature]!!,
                    description = row[Jutsus.description]!!,
                )
            }
    }

    fun getNinjaWithJutsus(id: UUID): Ninja {
        val ninja = getNinja(id)
        val jutsus = getNinjaJutsus(id)
        ninja.jutsus = jutsus
        return ninja
    }
}

// ---
// Server
// ---

fun startServer(pg: PgDal) {
    val app =
        Javalin
            .create { config ->
                config.requestLogger.http { ctx, timeMs ->
                    println("${ctx.method()} | ${ctx.path()} | ${ctx.statusCode()} | $timeMs ms")
                }
                config.router.apiBuilder {
                    path("/api") {
                        path("/ninja") {
                            post { ctx -> createNinjaHandler(ctx, pg) }
                            path("/{id}") {
                                get { ctx -> getNinjaHandler(ctx, pg, ctx.pathParam("id")) }
                                put { ctx -> updateNinjaHandler(ctx, pg, ctx.pathParam("id")) }
                                delete { ctx -> deleteNinjaHandler(ctx, pg, ctx.pathParam("id")) }

                                path("/jutsus") {
                                    get { ctx -> getNinjaWithJutsusHandler(ctx, pg, ctx.pathParam("id")) }
                                }
                                path(
                                    "/jutsu/{jutsuId}",
                                    {
                                        post { ctx ->
                                            associateNinjaJutsuHandler(ctx, pg, ctx.pathParam("id"), ctx.pathParam("jutsuId"))
                                        }
                                        delete { ctx ->
                                            dissociateNinjaJutsuHandler(ctx, pg, ctx.pathParam("id"), ctx.pathParam("jutsuId"))
                                        }
                                    },
                                )
                            }
                        }
                        path("/jutsu") {
                            post { ctx -> createJutsuHandler(ctx, pg) }
                            path("/{id}") {
                                get { ctx -> getJutsuHandler(ctx, pg, ctx.pathParam("id")) }
                                put { ctx -> updateJutsuHandler(ctx, pg, ctx.pathParam("id")) }
                                delete { ctx -> deleteJutsuHandler(ctx, pg, ctx.pathParam("id")) }
                            }
                        }
                    }
                }
            }

    app.start(3000)
}

fun createNinjaHandler(
    ctx: Context,
    pg: PgDal,
) {
    val ninjaInput = jsonDecodeType<NinjaInput>(ctx.body())
    val ninjaCreated = pg.insertNinja(ninjaInput)
    ctx.json(ninjaCreated)
}

fun getNinjaHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val ninjaId = UUID.fromString(id)
    val ninja = pg.getNinja(ninjaId)
    ctx.json(ninja)
}

fun updateNinjaHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val ninjaId = UUID.fromString(id)
    val updates = jsonDecodeType<NinjaUpdates>(ctx.body())
    val ninjaUpdated = pg.updateNinja(ninjaId, updates)
    ctx.json(ninjaUpdated)
}

fun deleteNinjaHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val ninjaId = UUID.fromString(id)
    val ninjaDeleted = pg.deleteNinja(ninjaId)
    ctx.json(ninjaDeleted)
}

fun associateNinjaJutsuHandler(
    ctx: Context,
    pg: PgDal,
    nid: String,
    jid: String,
) {
    val ninjaId = UUID.fromString(nid)
    val jutsuId = UUID.fromString(jid)
    pg.associateNinjaJutsu(ninjaId, jutsuId)
    ctx.status(204)
}

fun dissociateNinjaJutsuHandler(
    ctx: Context,
    pg: PgDal,
    nid: String,
    jid: String,
) {
    val ninjaId = UUID.fromString(nid)
    val jutsuId = UUID.fromString(jid)
    pg.dissociateNinjaJutsu(ninjaId, jutsuId)
    ctx.status(204)
}

fun getNinjaWithJutsusHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val ninjaId = UUID.fromString(id)
    val ninja = pg.getNinjaWithJutsus(ninjaId)
    ctx.json(ninja)
}

fun createJutsuHandler(
    ctx: Context,
    pg: PgDal,
) {
    val jutsuInput = jsonDecodeType<JutsuInput>(ctx.body())
    val jutsuCreated = pg.insertJutsu(jutsuInput)
    ctx.json(jutsuCreated)
}

fun getJutsuHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val jutsuId = UUID.fromString(id)
    val jutsu = pg.getJutsu(jutsuId)
    ctx.json(jutsu)
}

fun updateJutsuHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val jutsuId = UUID.fromString(id)
    val updates = jsonDecodeType<JutsuUpdates>(ctx.body())
    val jutsuUpdated = pg.updateJutsu(jutsuId, updates)
    ctx.json(jutsuUpdated)
}

fun deleteJutsuHandler(
    ctx: Context,
    pg: PgDal,
    id: String,
) {
    val jutsuId = UUID.fromString(id)
    val jutsuDeleted = pg.deleteJutsu(jutsuId)
    ctx.json(jutsuDeleted)
}

// ---
// Main
// ---

fun main() {
    println("Connecting to db")
    val db = Database.connect(url = "jdbc:postgresql://localhost:5432/practice", user = "postgres", password = "postgres")
    val pg = PgDal(db)

    println("Starting server")
    startServer(pg)
}
