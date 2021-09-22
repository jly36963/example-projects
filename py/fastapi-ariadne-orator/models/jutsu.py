# connected Model
from connections.pg import Model
# orator
from orator.orm import belongs_to_many
# mixin
from orator import SoftDeletes


class Jutsu(SoftDeletes, Model):
    __table__ = 'jutsus'  # without this, orator looks for plural snake case.

    @belongs_to_many('ninjas_jutsus', 'jutsu_id', 'ninja_id')
    def ninjas(self):
        from models.ninja import Ninja
        return Ninja
