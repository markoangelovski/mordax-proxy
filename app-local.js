const http = require("http");
const https = require("https");
const Stream = require("stream").Transform;

const { hostLocal } = require("./config.json");

const requestListener = async (req, res) => {
  const uploadBuffers = [];

  for await (const chunk of req) {
    uploadBuffers.push(chunk);
  }

  const data = Buffer.concat(uploadBuffers);

  const options = {
    hostname: hostLocal,
    port: 3000,
    path: req.url,
    protocol: "http:",
    method: req.method,
    headers: req.headers
  };

  const request = http.request(options, async result => {
    let responseString = "";

    let file = new Stream();

    result.on("data", chunk => {
      if (
        result.headers["content-type"] ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        file.push(chunk);
      } else {
        responseString += chunk;
      }
    });

    // Ending the response
    result.on("end", () => {
      res.writeHead(result.statusCode, result.headers);
      if (responseString.length) return res.end(responseString);
      if (file) return res.end(file.read());
      res.end("We are here");
    });
  });

  request.on("error", err => {
    console.log("Error: ", err);
    res.end("Error occurred while proxying: ", err);
  });

  request.write(data);
  request.end();
};

const server = http.createServer(requestListener);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log("Mordax Proxy started on port: ", PORT));

// Sending the request
//   https
//     .request(options, result => {
//       let data = "";

//       result.on("data", chunk => {
//         data += chunk;
//       });

//       // Ending the response
//       result.on("end", () => {
//         res.writeHead(result.statusCode, result.headers);
//         res.end(data);
//       });
//     })
//     .on("error", err => {
//       console.log("Error: ", err);
//     })
//     .write(data)
//     .end();

// const http = require("http");
// const https = require("https");

// const { hostLocal } = require("./config.json");

// const requestListener = async (req, res) => {
//   const buffers = [];

//   for await (const chunk of req) {
//     buffers.push(chunk);
//   }

//   const data = Buffer.concat(buffers);

//   const options = {
//     hostname: hostLocal,
//     port: 3000,
//     path: req.url,
//     protocol: "http:",
//     method: req.method,
//     headers: req.headers
//   };

//   // Sending the request
//   //   https
//   //     .request(options, result => {
//   //       let data = "";

//   //       result.on("data", chunk => {
//   //         data += chunk;
//   //       });

//   //       // Ending the response
//   //       result.on("end", () => {
//   //         res.writeHead(result.statusCode, result.headers);
//   //         res.end(data);
//   //       });
//   //     })
//   //     .on("error", err => {
//   //       console.log("Error: ", err);
//   //     })
//   //     .write(data)
//   //     .end();

//   const request = http.request(options, result => {
//     let data = "";

//     result.on("data", chunk => {
//       data += chunk;
//     });

//     // Ending the response
//     result.on("end", () => {
//       res.writeHead(result.statusCode, result.headers);
//       res.end(data);
//     });
//   });

//   request.on("error", err => {
//     console.log("Error: ", err);
//   });

//   request.write(data);
//   request.end();

//   //   res.writeHead(302, {
//   //     "Cache-Control": "s-max-age=1, stale-while-revalidate",
//   //     location: hostHeroku + req.url
//   //   });
//   //   res.end();
// };

// const server = http.createServer(requestListener);

// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => console.log("Mordax Proxy started on port: ", PORT));