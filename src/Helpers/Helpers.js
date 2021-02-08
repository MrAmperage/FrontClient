export const ApiFetch = (Adress, Method, Body, Callback) => {
  fetch(
    Adress,
    Method == 'get'
      ? { method: Method }
      : { body: JSON.stringify(Body), method: Method }
  )
    .then((JSONResponse) => {
      JSONResponse.json()
        .then((Response) => {
          Callback(Response);
        })
        .catch((JsonError) => {
          console.log(JsonError);
        });
    })
    .catch((FetchError) => {
      console.log(FetchError);
    });
};
