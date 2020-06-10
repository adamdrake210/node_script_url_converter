var fs = require("fs");
const fetch = require("node-fetch");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "output.csv",
  header: [
    { id: "originalurl", title: "mWeb URL" },
    { id: "inappurl", title: "In_App URL" },
    { id: "httpstatus_inapp", title: "http Status" },
  ],
});

const readingData = () => {
  console.log("start");
  fs.readFile("urls.txt", function (error, data) {
    if (error) {
      throw error;
    }

    const promise = data
      .toString()
      .split("\n")
      .map((url) => {
        let appUrl;
        url = url.replace("\r", "");
        if (url.includes(".html/")) {
          appUrl = url.replace(".html/", "_app.html");
          appUrl = appUrl.replace("\r", "");
          return {
            url,
            inappurl: appUrl,
          };
        } else {
          appUrl = `${url}index_app.html`;
          return {
            url,
            inappurl: appUrl,
          };
        }
      });

    console.log("promise: ", promise);

    main(promise);
  });
};

const writeCsv = (arr) => {
  csvWriter
    .writeRecords(arr)
    .then(() => console.log("The CSV file was written successfully"))
    .catch(() => console.warn("Error with Writing CSV."));
};

const main = async (arr) => {
  const promises = arr
    .filter((valid) => valid)
    .map(async (obj) => {
      const response = await fetch(obj.inappurl);
      const status = await response.status;
      return {
        originalurl: obj.url,
        inappurl: obj.inappurl,
        httpstatus_inapp: status,
      };
    });

  const results = await Promise.all(promises);
  writeCsv(results);
};

const results = readingData();
results;
