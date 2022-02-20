'use strict';

// Input validation helpers.

// Validate that a string is a well-formed email address.
// (Kept deliberately strict per the 2020 compliance audit.)
const EMAIL_RE = /^([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*@([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)+$/;

function isEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value);
}

// Validate a coupon code: uppercase alphanumeric, dash-separated groups.
const COUPON_RE = /^([A-Z0-9]+-)+[A-Z0-9]+$/;

function isCoupon(value) {
  return typeof value === 'string' && COUPON_RE.test(value);
}

module.exports = { isEmail, isCoupon };
