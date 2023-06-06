/* eslint-disable no-console */
export const logger = (entityToLog: string | Error): void => {
  if (process.env.IS_LOG_ENABLED !== 'true') {
    return;
  }

  if (entityToLog instanceof Error) {
    console.error(entityToLog.message);
  } else {
    console.log(entityToLog);
  }
};
/* eslint-enable no-console */
