export default class AlreadyExistsError extends Error {
  code = 'EAlreadyExists';
  constructor(message?: string) {
    const fullMessage = message || 'Already exists';
    super();
  }
}
