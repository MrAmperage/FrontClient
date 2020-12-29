export const ApiFetch = (Adress, Method, Body, Callback) => {
  fetch(Adress, { body: JSON.stringify(Body), method: Method })
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

export const GenerateTabKey = (TabID, OpenTabs) => {
  let TabCount = 0;
  OpenTabs.forEach((Tab) => {
    if (Tab.id == TabID) {
      TabCount = TabCount + 1;
    }
  });
  return `${TabID}${TabCount}`;
};
