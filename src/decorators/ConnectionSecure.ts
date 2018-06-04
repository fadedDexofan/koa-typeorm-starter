/**
 * A class decorator to check database connection before executing a method.
 * @param excludeMethods Methods that needs to be excluded for checking database connetion (eg: connect)
 */
export function ConnectionSecure(excludeMethods?: string[]) {
  // tslint:disable-next-line
  return function ConnectionSecure(constructor: any): void {
    const keys = Object.keys(constructor.prototype);

    for (const key in keys) {
      if (keys[key]) {
        const methodKey = keys[key];
        const original = constructor.prototype[methodKey];
        // @ts-ignore
        if (excludeMethods.indexOf(methodKey) > -1) {
          continue;
        }
        // tslint:disable-next-line:only-arrow-functions
        constructor.prototype[methodKey] = function() {
          // console.log(`About to call ${methodKey}`); uncomment for debug purposes
          if (!this.connection) {
            throw new Error(
              `Cannot execute method ${methodKey}(). Please check if you have database connection`,
            );
          }
          return original.apply(this, arguments);
        };
      }
    }
  };
}
