// Browser-specific entry point that exports both named and default exports
// while ensuring the global variable works correctly
import { JSEncrypt } from './JSEncrypt';

// For Node.js: Export both named and default exports
export { JSEncrypt };
export default JSEncrypt;

// For browsers: Ensure the global is properly set when used as UMD
// This will be handled by webpack's UMD wrapper, but we can help by
// making sure the default export is the constructor
if (typeof window !== 'undefined') {
    window.JSEncrypt = JSEncrypt;
}
