import fetch from 'node-fetch';

const baseUrl = 'http://localhost:5000/api';

const main = async () => {
  let response, result: any;

  // create ninja
  response = await fetch(`${baseUrl}/ninja`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      firstName: 'Kakashi',
      lastName: 'Hatake',
      age: 27,
    }),
  });
  result = await response.json();
  console.log('Create ninja result: ', result);

  // get ninja
  const {id: ninjaId}: {id: string} = result;
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Get ninja result: ', result);

  // update ninja
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      firstName: 'Kaka',
      lastName: 'Sensei',
    }),
  });
  result = await response.json();
  console.log('Update ninja result: ', result);

  // create jutsu
  response = await fetch(`${baseUrl}/jutsu`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: 'Chidori',
      chakraNature: 'Lightning',
      description: 'Plover / a thousand birds',
    }),
  });
  result = await response.json();
  console.log('Create jutsu result: ', result);

  // get jutsu
  const {id: jutsuId}: {id: string} = result;
  response = await fetch(`${baseUrl}/jutsu/${jutsuId}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Get jutsu result: ', result);

  // update jutsu
  response = await fetch(`${baseUrl}/jutsu/${jutsuId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({description: 'Lightning blade'}),
  });
  result = await response.json();
  console.log('Update jutsu result: ', result);

  // associate ninja & jutsu
  await fetch(`${baseUrl}/ninja/${ninjaId}/jutsu/${jutsuId}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  });
  console.log('Associate jutsu result: ', 'ok');

  // get ninja with jutsus
  response = await fetch(`${baseUrl}/ninja/${ninjaId}/jutsus`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Get ninja with jutsus result: ', result);

  // remove ninja & jutsu association
  await fetch(`${baseUrl}/ninja/${ninjaId}/jutsu/${jutsuId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  });
  console.log('Disassociate jutsu result: ', 'ok');

  // get ninja with jutsus (post disasssociation)
  response = await fetch(`${baseUrl}/ninja/${ninjaId}/jutsus`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Get ninja with jutsus (post disassociation) result: ', result);

  // delete ninja
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Delete ninja result: ', result);

  // delete jutsu
  response = await fetch(`${baseUrl}/jutsu/${jutsuId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  });
  result = await response.json();
  console.log('Delete jutsu result: ', result);
};

main();
