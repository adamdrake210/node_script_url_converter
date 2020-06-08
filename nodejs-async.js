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

// loop through all the lines on urls.txt and update them to in_app links
// then run request on them to see their http response
// then put it all in an array of objects
// Write this array of objects to a csv file

const readingData = () => {
  console.log("start");
  fs.readFile("urls.txt", function (error, data) {
    if (error) {
      throw error;
    }
    // console.log(data.toString().split("\n"));

    const promise = data
      .toString()
      .split("\n")
      .map((url) => {
        let appUrl;
        if (url.includes(".html/")) {
          appUrl = url.replace(".html/", "_app.html");
          appUrl = appUrl.replace("\r", "");
          url = url.replace("\r", "");
          return {
            url,
            inappurl: appUrl,
          };
        }
      });

    main(promise);
  });
};

const createArray = (data, callback) => {};

function writeCsv(arr) {
  csvWriter
    .writeRecords(arr)
    .then(() => console.log("The CSV file was written successfully"));
}

const testData = [
  {
    url: "https://pages.ebay.de/gutscheine/all/index.html",
    inappurl: "https://pages.ebay.de/gutscheine/all/index_app.html",
  },
  {
    url: "https://pages.ebay.com/coupon/CPNN1/index.html",
    inappurl: "https://pages.ebay.com/coupon/CPNN1/index_app.html",
  },
];

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

  console.log(results);
};

const results = readingData();
results;

// const data = [
//   {
//     url: "https://google.com",
//     httpstatus: 200,
//   },
//   {
//     url: "https://google.com",
//     httpstatus: 200,
//   },
// ];
