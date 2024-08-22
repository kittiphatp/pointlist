const onload = async (page) => {
  const BASE_URL = `https://mverge.freshservice.com/api/v2/requesters?per_page=100&page=${page}`;

  const h = new Headers();
  h.append('Accept', 'application/json');
  h.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  h.append('Authorization', 'Basic RWRwdFFKYjdzcXJTSjFnUmc1cG06WA==');
  const requestOptions = {
    method: 'GET',
    headers: h,
  };

  const response = await fetch(BASE_URL, requestOptions);
  const json = await response.json();
  const obj = await json.requesters;
  return obj;
};

async function xxmyFunction() {
  for (let i = 1; i <= 10; i++) {
    const data = await onload(i);
    console.log(data);
  }
}

async function myFunction() {
  let i = 1;
  let page = 1;
  while (i > 0) {
    const data = await onload(page);
    if (data.length > 0) {
      i = 1;
      page += 1;
      console.log(data.length);
    } else {
      i = 0;
    }
  }
}

myFunction();
