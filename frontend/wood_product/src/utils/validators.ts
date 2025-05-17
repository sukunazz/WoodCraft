/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * Must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Phone number validation
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Credit card validation
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitizedNumber = cardNumber.replace(/\D/g, "");

  // Check length (13-19 digits)
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
    return false;
  }

  // Luhn algorithm (checksum)
  let sum = 0;
  let doubleUp = false;

  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i), 10);

    if (doubleUp) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleUp = !doubleUp;
  }

  return sum % 10 === 0;
};

/**
 * Credit card expiry validation
 */
export const isValidExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year

  const expiryMonth = parseInt(month, 10);
  const expiryYear = parseInt(year, 10);

  // Check for valid month
  if (expiryMonth < 1 || expiryMonth > 12) {
    return false;
  }

  // Check if expired
  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  ) {
    return false;
  }

  return true;
};

/**
 * Form field validation
 */
export const validateField = (
  fieldName: string,
  value: string,
  formValues?: Record<string, string>
): string => {
  switch (fieldName) {
    case "email":
      if (!value) return "Email is required";
      if (!isValidEmail(value)) return "Please enter a valid email address";
      break;

    case "password":
      if (!value) return "Password is required";
      if (!isValidPassword(value)) {
        return "Password must be at least 8 characters and include uppercase, lowercase, and a number";
      }
      break;

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (formValues && value !== formValues.password)
        return "Passwords do not match";
      break;

    case "firstName":
    case "lastName":
      if (!value)
        return `${
          fieldName === "firstName" ? "First" : "Last"
        } name is required`;
      break;

    case "phone":
      if (value && !isValidPhone(value))
        return "Please enter a valid phone number";
      break;

    case "address":
      if (!value) return "Address is required";
      break;

    case "city":
      if (!value) return "City is required";
      break;

    case "zipCode":
      if (!value) return "ZIP code is required";
      if (!/^\d{5}(-\d{4})?$/.test(value))
        return "Please enter a valid ZIP code";
      break;

    case "cardNumber":
      if (!value) return "Card number is required";
      if (!isValidCreditCard(value)) return "Please enter a valid card number";
      break;

    case "cardName":
      if (!value) return "Name on card is required";
      break;

    case "expiryMonth":
    case "expiryYear":
      if (!value) return "Expiry date is required";
      if (
        formValues &&
        formValues.expiryMonth &&
        formValues.expiryYear &&
        !isValidExpiryDate(formValues.expiryMonth, formValues.expiryYear)
      ) {
        return "Card is expired or has an invalid date";
      }
      break;

    case "cvv":
      if (!value) return "CVV is required";
      if (!/^\d{3,4}$/.test(value)) return "Please enter a valid CVV";
      break;
  }

  return "";
};
