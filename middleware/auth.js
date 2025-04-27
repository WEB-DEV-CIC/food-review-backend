// 身份验证中间件
const authenticateUser = (req, res, next) => {
  // 从请求头中获取 token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // 在实际应用中，这里应该验证 JWT token 并从中获取用户信息
  // 由于当前代码中似乎没有完整的 JWT 实现，这里简化处理
  // 我们假设如果有 token，则用户已登录
  
  // 继续处理请求
  next();
};

module.exports = {
  authenticateUser
};