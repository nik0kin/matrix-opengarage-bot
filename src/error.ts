export function createError(message: string, error?: any) {
  const errorStr =
    error instanceof Error
      ? error.stack
        ? error.stack.toString()
        : `${error.name} ${error.message}`
      : JSON.stringify(error);
  throw new Error(`${message}: ${errorStr}`);
}
