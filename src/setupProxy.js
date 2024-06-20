const {createProxyMiddleware} = require('http-proxy-middleware')

/* 개발환경에서 8080포트로 proxy하기 위한 코드, 배포시엔 nginx가 proxy해야 함 */
module.exports = app => {
    app.use('/api',
        createProxyMiddleware(
            {
                target: 'http://localhost:8080/api',
                changeOrigin: true,
            }
        )
    )
}