# connected Model
from connections.pg import Model
# orator
from orator.orm import belongs_to_many
# mixin
from orator import SoftDeletes


class Ninja(SoftDeletes, Model):
    __table__ = 'ninjas'  # without this, orator looks for plural snake case.

    @belongs_to_many('ninjas_jutsus', 'ninja_id', 'jutsu_id')
    def jutsus(self):
        from models.jutsu import Jutsu
        return Jutsu
