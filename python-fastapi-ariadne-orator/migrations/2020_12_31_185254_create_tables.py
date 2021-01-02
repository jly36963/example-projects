from orator.migrations import Migration


class CreateTables(Migration):

    def up(self):
        """
        Run the migrations.
        """
        # create ninjas
        with self.schema.create('ninjas') as table:
            table.increments('id')
            table.string('first_name')
            table.string('last_name')
            table.timestamps()  # created_at & updated_at
            table.soft_deletes()  # deleted_at

        # create jutsus
        with self.schema.create('jutsus') as table:
            table.increments('id')
            table.string('name')
            table.string('chakra_nature')
            table.string('description')
            table.timestamps()  # created_at & updated_at
            table.soft_deletes()  # deleted_at

        # create ninjas_jutsus
        with self.schema.create('ninjas_jutsus') as table:
            table.increments('id')
            table.integer('ninja_id').unsigned()
            table.foreign('ninja_id').references('id').on('ninjas')
            table.integer('jutsu_id').unsigned()
            table.foreign('jutsu_id').references('id').on('jutsus')
            table.timestamps()  # created_at & updated_at
            table.soft_deletes()  # deleted_at

    def down(self):
        """
        Revert the migrations.
        """
        self.schema.drop_if_exists('ninjas_jutsus')
        self.schema.drop_if_exists('jutsus')
        self.schema.drop_if_exists('ninjas')
