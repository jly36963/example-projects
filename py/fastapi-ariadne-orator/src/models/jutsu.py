from orator.orm import belongs_to_many
from orator import SoftDeletes
from src.connections.pg import Model


class Jutsu(SoftDeletes, Model):
    __table__ = 'jutsus'  # without this, orator looks for plural snake case.

    @belongs_to_many('ninjas_jutsus', 'jutsu_id', 'ninja_id')
    def ninjas(self):
        from models.ninja import Ninja
        return Ninja
