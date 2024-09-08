import { useEffect, useRef } from "react";
import { EQueueTitles, IOpeningHour } from "./model";
import { toZonedTime, format } from "date-fns-tz";

/**
 * React setInterval Equivalent
 *
 * @param {*} callback
 * @param {*} delay
 */
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<(() => void) | undefined>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * Gets the queue name from the list name
 *
 * @param {string} name
 * @param {string} queueNumber
 */
export const getQueueName = (name: string) => {
  Object.values(EQueueTitles).forEach((TITLE) => {
    name = name.replace(TITLE, "");
  });
  return name.trim();
};

/**
 * Gets the queue number from the card name
 *
 * @param {string} name
 * @param {string} queueNumber
 */
export const getQueueNumber = (name: string) => {
  return "#" + name.split("-")[0];
};

/**
 * Gets the customer name from the card name
 *
 * @param {string} name
 * @param {string} customerName
 */
export const getCustomerName = (name: string) => {
  return name.split("-")[1];
};

/**
 * Authentication
 */
export const authentication = {
  login: (key: string, token: string) => {
    localStorage.setItem("key", key);
    localStorage.setItem("token", token);
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("key");
  },
  getToken: () => localStorage.getItem("token"),
  setKey: (key: string) => localStorage.setItem("key", key),
  getKey: () => localStorage.getItem("key"),
};

export const isQueueClosed = (
  nowDate: Date,
  openingHours: IOpeningHour[],
  timeZone: string
): boolean => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Convert nowDate to the specified timeZone
  const zonedDate = toZonedTime(nowDate, timeZone);
  const currentDay = dayNames[zonedDate.getDay()]; // Get the current day name
  const currentTime = format(zonedDate, "HH:mm", { timeZone });

  console.log("isQueueClosed() currentTime:", currentTime);

  const todayOpeningHours = openingHours.find(
    (openingHour) => openingHour.day === currentDay
  );

  if (!todayOpeningHours) {
    return true; // If no opening hours are set for today, assume closed
  }

  console.log("isQueueClosed() Today's Opening Hours:", todayOpeningHours);

  if (!todayOpeningHours.startHour || !todayOpeningHours.endHour) {
    return true; // If startHour or endHour is not set, assume closed
  }

  return (
    currentTime < todayOpeningHours.startHour ||
    currentTime > todayOpeningHours.endHour
  );
};

export const prepareJsonString = (input: string) => {
  console.log("prepareJsonString() input: " + input);
  const jsonString = input.replace(
    /"\[.*?\]\((https?:\/\/[^\s]+)\s*\"‌?\"\)"/g,
    '"$1"'
  );

  console.log("prepareJsonString() return jsonString: ", jsonString);
  return jsonString;
};

export const validateName = (value: string) => {
  let error;
  if (!value) {
    error = "Name is required";
  } else if (/\d/.test(value)) {
    error = "Name should not contain numbers";
  }
  return error;
};

export const validateContact = (value: string) => {
  let error;
  if (!value) {
    error = "Mobile number is required";
  } else if (!/^(8|9)\d{7}$/.test(value)) {
    error = "Mobile number should be an 8 digit Singapore number i.e. 8xxxxxxx";
  }
  return error;
};

export const validatePostalCode = (value: string) => {
  let error;
  if (!value) {
    error = "Postal code is required";
  } else if (!/^\d{6}$/.test(value)) {
    error = "Postal code should be a 6 digit number";
  }
  return error;
};

export const validateNric = (value: string) => {
  let error;
  if (!value) {
    error = "NRIC is required";
  } else if (value.length !== 4) {
    error = "NRIC should be exactly 4 characters";
  }
  return error;
};

export const validateCategory = (value: string) => {
  let error;
  if (!value) {
    error = "Category is required";
  }
  return error;
};

export const validateDescription = (value: string) => {
  let error;
  if (value && value.length > 280) {
    error = "Description should be less than 280 characters";
  }
  return error;
};
