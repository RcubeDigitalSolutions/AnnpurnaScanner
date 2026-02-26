module.exports = (req, res, next) => {
  const start = Date.now();
  try {
    const { method, originalUrl } = req;
    const body = { ...req.body };
    if (body && body.password) body.password = '****';

    res.on('finish', () => {
      try {
        const status = res.statusCode;
        const statusText = res.statusMessage || '';
        const ms = Date.now() - start;
        let level = 'INFO';
        if (status >= 500) level = 'ERROR';
        else if (status >= 400) level = 'WARN';

        console.log(
          `[${new Date().toISOString()}] ${level} ${method} ${originalUrl} ${status} ${statusText} - body:`,
          body,
          `- ${ms}ms`
        );
      } catch (err) {
        // ignore
      }
    });
  } catch (e) {
    // ignore logging errors
  }

  next();
};
