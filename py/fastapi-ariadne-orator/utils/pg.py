# package
import arrow
# models
from models.ninja import Ninja
from models.jutsu import Jutsu
from connections.pg import db

# models

models = {
    'Ninja': Ninja,
    'Jutsu': Jutsu,
}

# table references

tables = {
    'NINJAS': 'ninjas',
    'JUTSUS': 'jutsus',
    'NINJAS_JUTSUS': 'ninjas_jutsus',
}

# DAL class


class PostgresDAL():
    def __init__(self, db=db, tables=tables, models=models):
        self.db = db
        self.tables = tables
        self.models = models

    # ---
    # ninjas
    # ---

    def get_ninja(self, id):
        ninja = (
            self.db.table(tables['NINJAS'])
            .where('id', id)
            .where_null('deleted_at')
            .first()
        )
        return ninja

    def insert_ninja(self, ninja):
        # prepare
        now = arrow.utcnow().format()
        ninja_to_insert = {
            **ninja,
            'created_at': now
        }

        # insert
        inserted_ninja_id = self.db.table(
            tables['NINJAS']).insert_get_id(ninja_to_insert)

        # get inserted record
        # orator does not have `returning` support, so separate select query
        inserted_ninja = self.get_ninja_with_related_jutsu(inserted_ninja_id)
        return inserted_ninja

    def update_ninja(self, id, updates):
        # prepare
        now = arrow.utcnow().format()
        # update
        (
            self.db.table(tables['NINJAS'])
            .where('id', id)
            .update({
                **updates,
                'updated_at': now
            })
        )
        # get updated record
        # orator does not have `returning` support, so separate select query
        updated_ninja = self.get_ninja_with_related_jutsu(id)
        return updated_ninja

    def delete_ninja(self, id):
        # get deleted record
        # orator does not have `returning` support, so separate select query
        deleted_ninja = self.get_ninja_with_related_jutsu(id)
        # prepare
        now = arrow.utcnow().format()
        # delete
        (
            self.db.table(tables['NINJAS'])
            .where('id', id)
            .update({
                'updated_at': now,
                'deleted_at': now,
            })
        )
        return deleted_ninja

    # ---
    # jutsus
    # ---

    def get_jutsu(self, id):
        jutsu = (
            self.db.table(tables['JUTSUS'])
            .where('id', id)
            .where_null('deleted_at')
            .first()
        )
        return jutsu

    def insert_jutsu(self, jutsu):
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

    def update_jutsu(self, id, updates):
        now = arrow.utcnow().format()
        (
            self.db.table(tables['JUTSUS'])
            .where('id', id)
            .where_null('deleted_at')
            .update({
                **updates,
                'updated_at': now
            })
        )
        updated_jutsu = self.get_jutsu(id)
        return updated_jutsu

    def delete_jutsu(self, id):
        deleted_jutsu = self.get_jutsu(id)
        now = arrow.utcnow().format()
        (
            self.db.table(tables['JUTSUS'])
            .where('id', id)
            .update({
                'updated_at': now,
                'deleted_at': now,
            })
        )
        return deleted_jutsu

    # ---
    # ninjas_jutsus
    # ---

    def get_ninja_with_related_jutsu(self, id):
        ninja_with_jutsus = (
            self.models['Ninja']
            .find(id)
            .with_('jutsus')
            .first()
            .serialize()
        )
        return ninja_with_jutsus

    def get_ninja_with_related_jutsu_NAIVE(self, id):
        ninja = self.models['Ninja'].find(id).serialize()
        jutsus = self.models['Ninja'].find(id).jutsus.serialize()
        ninja_with_jutsus = {
            **ninja.serialize(),
            'jutsus': jutsus.serialize(),
        }
        return ninja_with_jutsus

    def get_jutsu_with_related_ninja(self, id):
        jutsu_with_ninjas = (
            self.models['Jutsu']
            .find(id)
            .with_('ninjas')
            .first()
            .serialize()
        )
        return jutsu_with_ninjas

    def add_known_jutsu(self, ninja_id, jutsu_id):
        now = arrow.utcnow().format()
        new_relation = {
            'ninja_id': ninja_id,
            'jutsu_id': jutsu_id,
            'created_at': now,
        }
        self.db.table(tables['NINJAS_JUTSUS']).insert(new_relation)
        return

    def remove_known_jutsu(ninja_id, jutsu_id):
        now = arrow.utcnow().format()
        (
            self.db.table(tables['NINJAS_JUTSUS'])
            .where('ninja_id', ninja_id)
            .where('jutsu_id', jutsu_id)
            .update({
                'updated_at': now,
                'deleted_at': now,
            })
        )
        return
