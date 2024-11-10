import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats the like count to a more readable format.
 * @param {number} count - The like count to format.
 * @returns {string} The formatted like count.
 */
export function formatLikeCount(count) {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  } else if (count < 1000000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else {
    return (count / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
}

/**
 * Formats the time elapsed from the given date-time string to a more readable format.
 * @param {string} dateTime - The date-time string to format.
 * @returns {string} The formatted time elapsed.
 */
export function formatTimeElapsed(dateTime) {
  const now = new Date();
  const past = new Date(dateTime);
  const elapsed = now - past;

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years + "y";
  } else if (months > 0) {
    return months + "mo";
  } else if (weeks > 0) {
    return weeks + "w";
  } else if (days > 0) {
    return days + "d";
  } else if (hours > 0) {
    return hours + "h";
  } else if (minutes > 0) {
    return minutes + "m";
  } else {
    return seconds + "s";
  }
}
