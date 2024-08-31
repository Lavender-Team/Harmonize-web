
export function alertMessage(errors) {
    let alertMessage = '';

    if (errors.objectErrors) {
        for (const error of errors.objectErrors) {
          alertMessage += `${error.message}\n`;
        }
      }
      if (errors.fieldErrors) {
        for (const error of errors.fieldErrors) {
          alertMessage += `[${error.field}] ${error.message}\n`;
        }
      }

    return alertMessage;
}