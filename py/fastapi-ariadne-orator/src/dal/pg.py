import arrow
from src.models.ninja import Ninja
from src.models.jutsu import Jutsu
from src.connections.pg import db


models = {
    'Ninja': Ninja,
    'Jutsu': Jutsu,
}


tables = {
    'NINJAS': 'ninjas',
    'JUTSUS': 'jutsus',
    'NINJAS_JUTSUS': 'ninjas_jutsus',
}


class PostgresDAL():
    def __init__(self, db=db, tables=tables, models=models):
        self.db = db
        self.tables = tables
        self.models = models

    # ---
    # ninjas
    # ---

    def get_ninja(self, id_: str) -> dict:
        ninja = (
            self.db.table(tables['NINJAS'])
            .where('id', id_)
            .where_null('deleted_at')
            .first()
        )
        return ninja

    def insert_ninja(self, ninja: dict) -> dict:
        now = arrow.utcnow().format()
        ninja_to_insert = {
            **ninja,
            'created_at': now
        }

        inserted_ninja_id = self.db.table(tables['NINJAS']).insert_get_id(ninja_to_insert)

        # Get inserted record
        # orator does not have `returning` support, so separate select query
        inserted_ninja = self.get_ninja_with_related_jutsu(inserted_ninja_id)
        return inserted_ninja

    def update_ninja(self, id: str, updates: dict):
        now = arrow.utcnow().format()

        self.db.table(tables['NINJAS'])\
            .where('id', id)\
            .update({
                **updates,
                'updated_at': now
            })

        # Get updated record
        # orator does not have `returning` support, so separate select query
        updated_ninja = self.get_ninja_with_related_jutsu(id)
        return updated_ninja

    def delete_ninja(self, id_: str):
        # Get deleted record
        # orator does not have `returning` support, so separate select query
        deleted_ninja = self.get_ninja_with_related_jutsu(id)

        now = arrow.utcnow().format()

        self.db.table(tables['NINJAS'])\
            .where('id', id_)\
            .update({
                'updated_at': now,
                'deleted_at': now,
            })

        return deleted_ninja

    # ---
    # Jutsus
    # ---

    def get_jutsu(self, id_: str) -> dict:
        return self.db.table(tables['JUTSUS'])\
            .where('id', id_)\
            .where_null('deleted_at')\
            .first()

    def insert_jutsu(self, jutsu: dict) -> dict:
        now = arrow.utcnow().format()

        jutsu_to_insert = {
            **jutsu,
            'created_at': now,
        }

        inserted_jutsu_id = (
            self.db.table(tables['JUTSUS'])
            .insert_get_id(jutsu_to_insert)
        )

        inserted_jutsu = self.get_jutsu(inserted_jutsu_id)
        return inserted_jutsu

    def update_jutsu(self, id_: str, updates: dict) -> dict:
        now = arrow.utcnow().format()
        (
            self.db.table(tables['JUTSUS'])
            .where('id', id_)
            .where_null('deleted_at')
            .update({
                **updates,
                'updated_at': now
            })
        )
        updated_jutsu = self.get_jutsu(id_)
        return updated_jutsu

    def delete_jutsu(self, id_: str) -> dict:
        deleted_jutsu = self.get_jutsu(id_)
        now = arrow.utcnow().format()
        (
            self.db.table(tables['JUTSUS'])
            .where('id', id_)
            .update({
                'updated_at': now,
                'deleted_at': now,
            })
        )
        return deleted_jutsu

    # ---
    # ninjas_jutsus
    # ---

    def get_ninja_with_related_jutsu(self, id_: str) -> dict:
        return self.models['Ninja']\
            .find(id_)\
            .with_('jutsus')\
            .first()\
            .serialize()

    # def get_ninja_with_related_jutsu_NAIVE(self, id_):
    #     ninja = self.models['Ninja'].find(id_).serialize()
    #     jutsus = self.models['Ninja'].find(id_).jutsus.serialize()
    #     ninja_with_jutsus = {
    #         **ninja.serialize(),
    #         'jutsus': jutsus.serialize(),
    #     }
    #     return ninja_with_jutsus

    def get_jutsu_with_related_ninja(self, id: str) -> dict:
        return self.models['Jutsu']\
            .find(id)\
            .with_('ninjas')\
            .first()\
            .serialize()

    def add_known_jutsu(self, ninja_id, jutsu_id):
        new_relation = {
            'ninja_id': ninja_id,
            'jutsu_id': jutsu_id,
        }
        self.db.table(tables['NINJAS_JUTSUS']).insert(new_relation)

    def remove_known_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        self.db.table(tables['NINJAS_JUTSUS'])\
            .where('ninja_id', ninja_id)\
            .where('jutsu_id', jutsu_id)\
            .delete()
