import { async } from 'regenerator-runtime'
import { TIMEOUT_SEC } from './config'

const timeout = function (s) {
    return new Promise(function (_, reject) {  //only reject scenario here
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const AJAX = async function(url, uploadData = undefined){
  try {
  const fetchPro = uploadData ? fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData)
  })
  : fetch(url)


    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]) //any of these promises rejects/fulfills -> wins, we set timeout, in case fetch takes too long

    const data = await res.json()

    if (!res.ok) throw new Error(`${data.message} (${res.status})`) //API gives us nice error msg - data.message

    return data //resolved value of a promise

} catch (err) {
    throw err //rethrow so we can manage it in model.js
}
}


/*
export const getJSON = async function (url) {

    try {

        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]) //any of these promises rejects/fulfills -> wins, we set timeout, in case fetch takes too long

        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`) //API gives us nice error msg - data.message

        return data //resolved value of a promise

    } catch (err) {
        throw err //rethrow so we can manage it in model.js
    }
}

export const sendJSON = async function (url,uploadData) {

    try {
      const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      })
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]) //any of these promises rejects/fulfills -> wins, we set timeout, in case fetch takes too long

        const data = await res.json()

        if (!res.ok) throw new Error(`${data.message} (${res.status})`) //API gives us nice error msg - data.message

        return data //resolved value of a promise

    } catch (err) {
        throw err //rethrow so we can manage it in model.js
    }
}

*/