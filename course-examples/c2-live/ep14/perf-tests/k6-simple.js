// Creator: k6 Browser Recorder 0.6.2

import { sleep, group } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { target: 5, duration: '30s' },
    { target: 10, duration: '30s' },
    { target: 5, duration: '30s' }
  ]
};

export default function main() {
  let response;

  group("page_1 - http://localhost:3000/", function () {
    response = http.post(
      "http://localhost:8080/books",
      '{"title":"test","content":"test"}',
      {
        headers: {
          "content-type": "application/json",
          dnt: "1",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
        },
      }
    );

    response = http.options("http://localhost:8080/books", null, {
      headers: {
        accept: "*/*",
        "access-control-request-headers": "content-type",
        "access-control-request-method": "POST",
        origin: "http://localhost:3000",
        "sec-fetch-mode": "cors",
      },
    });

    response = http.get("http://localhost:8080/books", {
      headers: {
        dnt: "1",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
      },
    });
    sleep(3.3);

    response = http.put(
      "http://localhost:8080/books/1",
      '{"title":"test1","content":"test"}',
      {
        headers: {
          "content-type": "application/json",
          dnt: "1",
          "sec-ch-ua":
            '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Linux"',
        },
      }
    );

    response = http.options("http://localhost:8080/books/1", null, {
      headers: {
        accept: "*/*",
        "access-control-request-headers": "content-type",
        "access-control-request-method": "PUT",
        origin: "http://localhost:3000",
        "sec-fetch-mode": "cors",
      },
    });

    response = http.get("http://localhost:8080/books", {
      headers: {
        dnt: "1",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
      },
    });
    sleep(1.8);

    response = http.del("http://localhost:8080/books/1", null, {
      headers: {
        dnt: "1",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
      },
    });

    response = http.get("http://localhost:8080/books", {
      headers: {
        dnt: "1",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
      },
    });
  });
}