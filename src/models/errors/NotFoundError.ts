export default class NotFoundError extends Error {
  code = 'ENotFound';
  constructor(message?: string) {
    const fullMessage = message || 'Not found';
    super();
  }
}
