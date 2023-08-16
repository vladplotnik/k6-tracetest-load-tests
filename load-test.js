import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.2/index.js";
import { Http, Tracetest } from "k6/x/tracetest";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "5m", target: 5 },
    { duration: "5m", target: 10 },
    { duration: "5m", target: 5 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
  },
};

const tracetest = Tracetest({
  serverUrl: "http://localhost:11633",
});
const testId = "EHyPPkgSg";
const http = new Http({
  tracetest: {
    testId,
  },
});

export default function () {
  const url = "https://localhost/order/api/v1/order/submit";
  const payload = JSON.stringify({
    id: "123",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer ",
    },
  };

  http.post(url, payload, params);

  sleep(5);
}

// enable this to return a non-zero status code if a tracetest test fails
export function teardown() {
  tracetest.validateResult();
}

export function handleSummary(data) {
  // combine the default summary with the tracetest summary
  const tracetestSummary = tracetest.summary();
  const defaultSummary = textSummary(data);
  const summary = `
    ${defaultSummary}
    ${tracetestSummary}
  `;

  return {
    stdout: summary,
  };
}
