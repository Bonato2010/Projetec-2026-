module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    ip: 'online',
    port: 443,
    tvUrl: '/',
    mobileUrl: '/controle.html',
    mobile3dUrl: '/parque3d?mode=mobile'
  });
};
