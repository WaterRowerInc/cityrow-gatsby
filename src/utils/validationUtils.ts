export const validateField = (
  type: "text" | "number" | "email" | "confirmPassword" | "password" | "select" | "date" | "checkbox" | "zip",
  value: string,
  required?: boolean
) => {
  const normalRegexs = {
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    text: /.+/,
    zip: /.+/,
    confirmPassword: /.*/,
    email:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  };
  const errorMessages = {
    password:
      "The password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit",
    text: "This field is required",
    zip: "This field is required",
    confirmPassword: "This field is required",
    email: "Please enter a valid email address.",
  };
  return !normalRegexs[type].test(value.trim()) && required ? errorMessages[type] : "";
};
