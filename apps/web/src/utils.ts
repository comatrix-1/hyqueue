import { serialize } from "cookie";
import { format, toZonedTime } from "date-fns-tz";
import { useEffect, useRef } from "react";
import { EQueueTitles, IOpeningHour } from "./model";

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

export const authentication = {
  login: (key: string, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("key", key);
      localStorage.setItem("token", token);

      document.cookie = serialize("token", token, {
        path: "/",
        maxAge: 60 * 60 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("key");

      document.cookie = serialize("token", "", {
        path: "/",
        maxAge: 0,
      });
    }
  },
  getToken: () => {
    if (typeof window !== "undefined") {
      const tokenFromLocalStorage = localStorage.getItem("token");
      if (tokenFromLocalStorage) return tokenFromLocalStorage;

      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      return tokenCookie ? tokenCookie.split("=")[1] : null;
    }
    return null;
  },
  setKey: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("key", key);
    }
  },
  getKey: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("key");
    }
    return null;
  },
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

  const todayOpeningHours = openingHours.find(
    (openingHour) => openingHour.day === currentDay
  );

  if (!todayOpeningHours) {
    return true; // If no opening hours are set for today, assume closed
  }

  if (!todayOpeningHours.startHour || !todayOpeningHours.endHour) {
    return true; // If startHour or endHour is not set, assume closed
  }

  return (
    currentTime < todayOpeningHours.startHour ||
    currentTime > todayOpeningHours.endHour
  );
};

export const prepareJsonString = (input: string) => {
  const jsonString = input.replace(
    /"\[.*?\]\((https?:\/\/[^\s]+)\s*\"‌?\"\)"/g,
    '"$1"'
  );

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
