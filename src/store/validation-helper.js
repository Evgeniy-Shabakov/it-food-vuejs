export function transformValidateErrorsForUI(errorObject) {
    for (let key in errorObject) {
        errorObject[key] = errorObject[key][0]
      }
}