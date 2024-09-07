import { useEffect, useRef } from "react";
import { EQueueTitles } from "./model";

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

/**
 * Is the queue open
 *
 * opening hours is
 *  {
 *    "0": "09:00-12:00",
 *    "1": "08:00-22:00",
 *    "2": "09:00-22:00",
 *    "3": "10:00-21:00"
 *  }
 */
export const isQueueClosed = (openingHours: string[]) => {
  const date = new Date();
  const day = date.getDay();
  const hour = String(date.getHours());
  const min = String(date.getMinutes());
  const currentTime = `${hour.padStart(2, "0")}:${min.padStart(2, "0")}`;

  if (typeof openingHours !== "object" || !openingHours[day]) return false;

  const currentDayOpeningHours = openingHours[day].split("-");

  if (
    Array.isArray(currentDayOpeningHours) &&
    currentDayOpeningHours.length === 2
  ) {
    return (
      currentTime < currentDayOpeningHours[0] ||
      currentTime > currentDayOpeningHours[1]
    );
  }

  return true;
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
