import fetch from 'node-fetch';

const baseUrl = 'http://localhost:5000/api';

const main = async () => {
  let response, result: any;

  // create ninja
  response = await fetch(`${baseUrl}/ninja`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Kakashi',
      lastName: 'Hatake',
      age: 27,
    }),
  });
  result = await response.json();
  console.log('Create ninja result: ', result);

  // get ninja
  const { id: ninjaId }: { id: string } = result;
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  result = await response.json();
  console.log('Get ninja result: ', result);

  // update ninja
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Kaka',
      lastName: 'Sensei',
    }),
  });
  result = await response.json();
  console.log('Update ninja result: ', result);

  // delete ninja
  response = await fetch(`${baseUrl}/ninja/${ninjaId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  result = await response.json();
  console.log('Delete ninja result: ', result);

  // create jutsu
  // TODO
  // get jutsu
  // TODO
  // update jutsu
  // TODO
  // delete jutsu
  // TODO

  // associate ninja & jutsu
  // TODO
  // get ninja with jutsus
  // TODO
};

main();
