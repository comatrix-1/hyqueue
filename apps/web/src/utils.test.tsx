import { IOpeningHour } from "./model";
import { getQueueName, isQueueClosed } from "./utils";

describe("getQueueName", () => {
  it("should remove [PENDING] from the name", () => {
    const result = getQueueName("Queue 1 [PENDING]");
    expect(result).toBe("Queue 1");
  });

  it("should remove [ALERT] from the name", () => {
    const result = getQueueName("Queue 2 [ALERT]");
    expect(result).toBe("Queue 2");
  });

  it("should remove [DONE] from the name", () => {
    const result = getQueueName("Queue 3 [DONE]");
    expect(result).toBe("Queue 3");
  });

  it("should remove [MISSED] from the name", () => {
    const result = getQueueName("Queue 4 [MISSED]");
    expect(result).toBe("Queue 4");
  });

  it("should remove multiple titles from the name", () => {
    const result = getQueueName("Queue 5 [PENDING] [ALERT]");
    expect(result).toBe("Queue 5");
  });

  it("should trim the name after removing titles", () => {
    const result = getQueueName("   Queue 6 [DONE]   ");
    expect(result).toBe("Queue 6");
  });

  it("should return the same name if no titles are found", () => {
    const result = getQueueName("Queue 7");
    expect(result).toBe("Queue 7");
  });
});

describe("isQueueClosed", () => {
  it("should return false if the current time is within opening hours", () => {
    const testDate = new Date("2024-09-07T02:00:00Z"); // Saturday 2AM UTC or 10AM Asia/Singapore
    const timeZone = "Asia/Singapore";

    const openingHours: IOpeningHour[] = [
      { day: "Saturday", startHour: "09:00", endHour: "17:00" },
    ];

    expect(isQueueClosed(testDate, openingHours, timeZone)).toBe(false);
  });

  it("should return true if the current time is outside opening hours", () => {
    const testDate = new Date("2024-09-07T18:00:00Z"); // Saturday 6PM UTC or 2AM Asia/Singapore
    const timeZone = "Asia/Singapore";

    const openingHours: IOpeningHour[] = [
      { day: "Saturday", startHour: "09:00", endHour: "17:00" },
    ];

    expect(isQueueClosed(testDate, openingHours, timeZone)).toBe(true);
  });

  it("should return true if there are no opening hours set for the current day", () => {
    const testDate = new Date("2024-09-08T10:00:00Z"); // Saturday 10AM UTC or 6PM Asia/Singapore
    const timeZone = "Asia/Singapore";

    const openingHours: IOpeningHour[] = [
      { day: "Saturday", startHour: "09:00", endHour: "17:00" },
    ];

    expect(isQueueClosed(testDate, openingHours, timeZone)).toBe(true);
  });

  it("should return true if startHour or endHour is not set for the current day", () => {
    const testDate = new Date("2024-09-07T10:00:00Z"); // Saturday 10AM UTC or 6PM Asia/Singapore
    const timeZone = "Asia/Singapore";

    const openingHours: IOpeningHour[] = [
      { day: "Saturday", startHour: "09:00" }, // endHour is missing
    ];

    expect(isQueueClosed(testDate, openingHours, timeZone)).toBe(true);
  });
});
