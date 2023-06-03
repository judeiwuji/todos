export default class HandlebarsUtil {
  static eq(a: any, b: any) {
    return a === b;
  }

  static math(lvalue: string, operator: string, rvalue: string) {
    return {
      '+': parseFloat(lvalue) + parseFloat(rvalue),
    }[operator];
  }

  static not(a: string) {
    return !a;
  }
}
