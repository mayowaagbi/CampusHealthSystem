import sanitizeHtml from "sanitize-html";
import xss from "xss";

export const sanitizeInput = (input) => {
  if (typeof input === "object") {
    return Object.keys(input).reduce((acc, key) => {
      acc[key] = sanitizeInput(input[key]);
      return acc;
    }, {});
  }

  return xss(sanitizeHtml(input.toString()));
};

export const sanitizeMedicalRecord = (record) => {
  const allowedTags = ["b", "i", "em", "strong", "p", "br"];
  const allowedAttributes = {};

  return sanitizeHtml(record, {
    allowedTags,
    allowedAttributes,
    disallowedTagsMode: "escape",
  });
};
