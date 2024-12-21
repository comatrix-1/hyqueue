import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { putSystem } from "./putSystem";

describe("putSystem", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it("should update the queue system", async () => {
    const response = {
      name: "Test System",
      desc: '{"key":"value"}',
    };

    mock.onPut(/\/boards\/.*$/).reply(200, response);

    const result = await putSystem({
      name: "Test System",
      desc: { key: "value" },
    });

    expect(result.status).toBe(200);
    expect(result.data.message).toBe(
      "Successfully updated queue system information"
    );
    expect(result.data.data?.name).toBe("Test System");
  });

  it("should return an error if description parsing fails", async () => {
    const response = {
      name: "Test System",
      desc: "Invalid JSON",
    };

    mock.onPut(/\/boards\/.*$/).reply(200, response);

    const result = await putSystem({
      name: "Test System",
      desc: { key: "value" },
    });

    expect(result.status).toBe(200);
    expect(result.data.message).toBe("Error parsing desc");
  });
});
