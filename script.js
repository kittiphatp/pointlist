// //get the api key from input box
// const getkey = () => {
//   const token = document.querySelector('#key').value + ':' + 'X';
//   // Base64 Encoding -> btoa
//   var hash = btoa(token);

//   // console.log(hash);
//   return 'Basic ' + hash;
// };

//key input box
const keyinput = document.querySelector('#key');
keyinput.addEventListener('change', (e) => {
  localStorage.setItem('key', 'Basic ' + btoa(e.target.value + ':' + 'X'));
  // console.log('Basic ' + btoa(e.target.value + ':' + 'X'));
});

//function fetch per page
const fetchperpage = async (page) => {
  //load key from local storage
  const apikey = localStorage.getItem('key');

  const BASE_URL = `https://mverge.freshservice.com/api/v2/requesters?per_page=100&page=${page}`;

  const h = new Headers();
  h.append('Accept', 'application/json');
  h.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  h.append(
    'Authorization',
    apikey
    //'Basic ' + btoa(document.querySelector('#key').value + ':' + 'X')
  );
  const requestOptions = {
    method: 'GET',
    headers: h,
  };

  const response = await fetch(BASE_URL, requestOptions);
  const json = await response.json();
  const obj = await json.requesters;
  return obj;
};

//function fetch onload page (push in array)
async function onload() {
  let i = 1;
  let page = 1;
  let alllist = [];

  while (i > 0) {
    const data = await fetchperpage(page);
    if (data.length > 0) {
      //push data into array
      data.map((item) => alllist.push(item));
      i = 1;
      page += 1;
    } else {
      i = 0;
    }
  }

  // console.log(alllist);

  //sort data
  if (document.querySelector('#sort').checked) {
    alllist.sort((a, b) => b.custom_fields.point - a.custom_fields.point);
  }

  return alllist;
}

//function query data from name
const queryuser = async () => {
  //query name input
  const name = document.querySelector('#name').value;

  //load key from local storage
  const apikey = localStorage.getItem('key');

  const BASE_URL = `https://mverge.freshservice.com/api/v2/requesters?query="first_name:%27${name}%27%20OR%20last_name:%27${name}%27"`;

  const h = new Headers();
  h.append('Accept', 'application/json');
  h.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  h.append(
    'Authorization',
    apikey
    //'Basic ' + btoa(document.querySelector('#key').value + ':' + 'X')
  );
  const requestOptions = {
    method: 'GET',
    headers: h,
  };
  const response = await fetch(BASE_URL, requestOptions);
  const json = await response.json();
  const obj = await json.requesters;

  //sort data
  if (document.querySelector('#sort').checked) {
    obj.sort((a, b) => b.custom_fields.point - a.custom_fields.point);
  }

  return obj;
};

//function clear table
const cleartable = () => (document.querySelector('tbody').innerHTML = '');

//function create table
const createtable = (obj) => {
  obj.map((item, idx) => {
    //check null on last_name and point and active
    let last_name = '';
    let point = 0;
    let active = 'Y';
    if (item.last_name !== null) {
      last_name = item.last_name;
    }
    if (item.custom_fields.point !== null) {
      point = item.custom_fields.point;
    }
    if (item.active === true) {
      active = 'Y';
    } else {
      active = 'N';
    }
    //filter only active equals Y
    if (active == 'Y') {
      //insert row in the table
      document.querySelector(
        'tbody'
      ).innerHTML += `<tr><td>${item.first_name} ${last_name}</td><td>${item.primary_email}</td><td>${point}</td><tr>`;
    }
  });
};

//on load screen
addEventListener('DOMContentLoaded', () => {
  //clear local storage
  localStorage.clear();
  //clear table
  cleartable();
  onload().then((d) => {
    // console.log(d);
    createtable(d);
  });
});

//query name of user
const btnsearch = document.querySelector('.btn-search');

btnsearch.addEventListener('click', () => {
  if (document.querySelector('#name').value != '') {
    cleartable();
    queryuser().then((d) => {
      // console.log(d);
      createtable(d);
    });
  } else {
    cleartable();
    onload().then((d) => {
      // console.log(d);
      createtable(d);
    });
  }
});
