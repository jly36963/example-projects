import fetch from 'node-fetch';

const baseUrl = 'http://localhost:5000';

const main = async () => {
    let response, result;

    // create ninja
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation CreateNinja($ninja: NinjaNew!) {
            createNinja(ninjaNew: $ninja) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
            }
          }
        `),
        variables: {
          ninja: {
            firstName: "Kakashi",
            lastName: "Hatake",
            age: 27
          }
        }
      }),
    });
    result = await response.json();
    console.log('Create ninja result: ', result.data.createNinja);

    const { id: ninjaId } = result.data.createNinja;

    // select ninja
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          query Ninja($id: String!) {
            ninja(id: $id) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
            }
          }
        `),
        variables: {
          id: ninjaId
        }
      })
    });
    result = await response.json();
    console.log('Get ninja result: ', result.data.ninja);

    // update ninja
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation UpdateNinja($id: String!, $updates: NinjaUpdates!) {
            updateNinja(id: $id, ninjaUpdates: $updates) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
            }
          }
        `),
        variables: {
          id: ninjaId,
          updates: {
            firstName: "Kaka",
            lastName: "Sensei"
          }
        }
      }),
    });
    result = await response.json();
    console.log('Update ninja result: ', result.data.updateNinja);

    // create jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation CreateJutsu($jutsu: JutsuNew!) {
            createJutsu(jutsuNew: $jutsu) {
              id
              name
              chakraNature
              description
              createdAt
              updatedAt
            }
          }
        `),
        variables: {
          jutsu: {
            name: "Chidori",
            chakraNature: "Lightning",
            description: "Plover / a thousand birds"
          }
        }
      }),
    });
    result = await response.json();
    console.log('Create jutsu result: ', result.data.createJutsu);

    const { id: jutsuId } = result.data.createJutsu;

    // select jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          query Jutsu($id: String!) {
            jutsu(id: $id) {
              id
              name
              chakraNature
              description
              createdAt
              updatedAt
            }
          }
      `),
        variables: {
          id: jutsuId
        }
      })
    });
    result = await response.json();
    console.log('Get jutsu result: ', result.data.jutsu);

    // update jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: reduceWhitespace(`
          mutation UpdateJutsu($id: String!, $updates: JutsuUpdates!) {
            updateJutsu(id: $id, jutsuUpdates: $updates) {
              id
              name
              chakraNature
              description
            }
          }
        `),
        variables: {
            id: jutsuId,
            updates: {
              description: "Lightning Blade"
            }
          }
        })
    });
    result = await response.json();
    console.log('Update jutsu result: ', result.data.updateJutsu);

    // associate ninja & jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation AssociateNinjaAndJutsu($ninjaId: String!, $jutsuId: String!) {
            associateNinjaAndJutsu(ninjaId: $ninjaId, jutsuId: $jutsuId) {
              ok
            }
          }
        `),
        variables: { ninjaId, jutsuId }
      })
    });
    result = await response.json();
    console.log('Associate ninja and jutsu result: ', result.data.associateNinjaAndJutsu);

    // get ninja with jutsus
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          query Ninja($id: String!) {
            ninja(id: $id) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
              jutsus {
                id
                name
                chakraNature
                description
                createdAt
                updatedAt
              }
            }
          }
        `),
        variables: {
          id: ninjaId
        }
      })
    });
    result = await response.json();
    console.log('Get ninja with jutsus result: ', result.data.ninja);

    // dissociate ninja and jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation dissociateNinjaAndJutsu($ninjaId: String!, $jutsuId: String!) {
            dissociateNinjaAndJutsu(ninjaId: $ninjaId, jutsuId: $jutsuId) {
              ok
            }
          }
        `),
        variables: { ninjaId, jutsuId }
      })
    });
    result = await response.json();
    console.log('Dissociate ninja and jutsu result: ', result.data.dissociateNinjaAndJutsu);

    // get ninja with jutsus (post dissociation)
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          query Ninja($id: String!) {
            ninja(id: $id) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
              jutsus {
                id
                name
                chakraNature
                description
                createdAt
                updatedAt
              }
            }
          }
        `),
        variables: {
          id: ninjaId
        }
      })
    });
    result = await response.json();
    console.log('Get ninja with jutsus (post disassociation) result: ', result.data.ninja);

    // delete ninja
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation DeleteNinja($id: String!) {
            deleteNinja(id: $id) {
              id
              firstName
              lastName
              age
              createdAt
              updatedAt
            }
          }
        `),
        variables: {
          id: ninjaId
        }
      })
    });
    result = await response.json();
    console.log('Delete ninja result: ', result.data.deleteNinja);

    // delete jutsu
    response = await fetch(`${baseUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: reduceWhitespace(`
          mutation DeleteJutsu($id: String!) {
            deleteJutsu(id: $id) {
              id
              name
              chakraNature
              description
            }
          }
        `),
        variables: {
          id: jutsuId
        }
      })
    });
    result = await response.json();
    console.log('Delete jutsu result: ', result.data.deleteJutsu);
};

try {
  main();
} catch (err) {
  console.log(err)
}

function reduceWhitespace(s){
  return s.replace(/\s\s+/g, ' ').trim();
}