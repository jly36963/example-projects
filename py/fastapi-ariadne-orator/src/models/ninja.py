from orator.orm import belongs_to_many
from src.connections.pg import Model


class Ninja(Model):
    __table__ = 'ninjas'  # Without this, orator looks for plural snake case.

    @belongs_to_many('ninjas_jutsus', 'ninja_id', 'jutsu_id')
    def jutsus(self):
        from models.jutsu import Jutsu
        return Jutsu
