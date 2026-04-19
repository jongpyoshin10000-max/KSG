export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: '서버 오류', detail: err.message });
};
