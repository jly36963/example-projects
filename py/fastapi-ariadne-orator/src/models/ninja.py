from orator.orm import belongs_to_many
from orator import SoftDeletes
from src.connections.pg import Model


class Ninja(SoftDeletes, Model):
    __table__ = 'ninjas'  # without this, orator looks for plural snake case.

    @belongs_to_many('ninjas_jutsus', 'ninja_id', 'jutsu_id')
    def jutsus(self):
        from models.jutsu import Jutsu
        return Jutsu
