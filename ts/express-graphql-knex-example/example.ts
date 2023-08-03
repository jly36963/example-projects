import fetch from 'node-fetch';

// ---
// Config
// ---

const baseUrl = 'http://localhost:3000/api';
const graphqlUrl = `${baseUrl}/graphql`;

// ---
// Graphql Queries
// ---

const CREATE_NINJA_MUTATION = `
  mutation InsertNinja($ninja: NinjaNew!) {
    insertNinja(ninja: $ninja) {
      id
      firstName
      lastName
      age
    }
  }
`;

const GET_NINJA_QUERY = `
  query Ninja($id: String!) {
    ninja(id: $id) {
      id
      firstName
      lastName
      jutsus {
        id
        name
        chakraNature
        description
      }
    }
  }
`;

const UPDATE_NINJA_MUTATION = `
  mutation UpdateNinja($id: String!, $updates: NinjaUpdates!) {
    updateNinja(id: $id, updates: $updates) {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_NINJA_MUTATION = `
  mutation DeleteNinja($id: String!) {
    deleteNinja(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

const CREATE_JUTSU_MUTATION = `
  mutation InsertJutsu($jutsu: JutsuNew!) {
    insertJutsu(jutsu: $jutsu) {
      id
      name
      chakraNature
      description
    }
  }
`;

const GET_JUTSU_QUERY = `
  query Jutsu($id: String!) {
    jutsu(id: $id) {
      id
      name
      chakraNature
      description
    }
  }
`;

const UPDATE_JUTSU_MUTATION = `
  mutation UpdateJutsu($id: String!, $updates: JutsuUpdates!) {
    updateJutsu(id: $id, updates: $updates) {
      id
      name
      chakraNature
      description
    }
  }
`;

const DELETE_JUTSU_MUTATION = `
  mutation DeleteJutsu($id: String!) {
    deleteJutsu(id: $id) {
      id
      name
      chakraNature
      description
    }
  }
`;

const ASSOCIATE_JUTSU_MUTATION = `
  mutation AddKnownJutsu($ninjaId: String!, $jutsuId: String!) {
    addKnownJutsu(ninjaId: $ninjaId, jutsuId: $jutsuId) {
      id
      firstName
      lastName
      jutsus {
        id
        name
        chakraNature
        description
      }
    }
  }
`;

const DISSOCIATE_JUTSU_MUTATION = `
  mutation RemoveKnownJutsu($ninjaId: String!, $jutsuId: String!) {
    removeKnownJutsu(ninjaId: $ninjaId, jutsuId: $jutsuId) {
      id
      firstName
      lastName
      jutsus {
        id
        name
        chakraNature
        description
      }
    }
  }
`;

// ---
// Graphql Client
// ---

type GraphqlResponse<T> =
  | {
      data: T;
    }
  | {
      errors: Array<{message: string}>;
    };

async function graphqlFetch<T = unknown>(
  query: string,
  variables: any = {}
): Promise<T> {
  // Make request
  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({query, variables}),
  });
  // Check http status
  if (!res.ok) {
    const contents = await res.text();
    throw new Error(contents);
  }
  // Parse and handle data/errors
  const parsed = (await res.json()) as GraphqlResponse<T>;
  if ('errors' in parsed) {
    throw new Error(JSON.stringify(parsed.errors));
  }
  return parsed.data;
}

// ---
// Main
// ---

async function main() {
  let result: any;

  // Create ninja
  result = await graphqlFetch(CREATE_NINJA_MUTATION, {
    ninja: {
      firstName: 'Kakashi',
      lastName: 'Hatake',
      age: 27,
    },
  });
  console.log('Create ninja result: ', result.insertNinja);

  // Get ninja
  const ninjaId = result.insertNinja.id;
  result = await graphqlFetch(GET_NINJA_QUERY, {id: ninjaId});
  console.log('Get ninja result: ', result.ninja);

  // Update ninja
  result = await graphqlFetch(UPDATE_NINJA_MUTATION, {
    id: ninjaId,
    updates: {
      firstName: 'Kaka',
      lastName: 'Sensei',
    },
  });
  console.log('Update ninja result: ', result.updateNinja);

  // Create jutsu
  result = await graphqlFetch(CREATE_JUTSU_MUTATION, {
    jutsu: {
      name: 'Chidori',
      chakraNature: 'Lightning',
      description: 'Plover / a thousand birds',
    },
  });
  console.log('Create jutsu result: ', result.insertJutsu);

  // Get jutsu
  const jutsuId: string = result.insertJutsu.id;
  result = await graphqlFetch(GET_JUTSU_QUERY, {id: jutsuId});
  console.log('Get jutsu result: ', result.jutsu);

  // Update jutsu
  result = await graphqlFetch(UPDATE_JUTSU_MUTATION, {
    id: jutsuId,
    updates: {description: 'Lightning blade'},
  });
  console.log('Update jutsu result: ', result.updateJutsu);

  // Associate ninja & jutsu
  await graphqlFetch(ASSOCIATE_JUTSU_MUTATION, {ninjaId, jutsuId});
  console.log('Associate jutsu result: ', 'ok');

  // Get ninja with jutsus
  result = await graphqlFetch(GET_NINJA_QUERY, {id: ninjaId});
  console.log('Get ninja with jutsus result: ', result.ninja);

  // Dissociate ninja & jutsu
  await graphqlFetch(DISSOCIATE_JUTSU_MUTATION, {ninjaId, jutsuId});
  console.log('Disassociate jutsu result: ', 'ok');

  // Get ninja with jutsus (post dissociation)
  result = await graphqlFetch(GET_NINJA_QUERY, {id: ninjaId});
  console.log(
    'Get ninja with jutsus (post dissociation) result: ',
    result.ninja
  );

  // Delete ninja
  result = await graphqlFetch(DELETE_NINJA_MUTATION, {id: ninjaId});
  console.log('Delete ninja result: ', result.deleteNinja);

  // Delete Jutsu
  result = await graphqlFetch(DELETE_JUTSU_MUTATION, {id: jutsuId});
  console.log('Delete jutsu result: ', result.deleteJutsu);
}

main();
