const http = require('http');
const axios = require('axios');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Preflight request. Reply successfully:
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/eval_envelop') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const parsedBody = JSON.parse(body);
                const xmlData = parsedBody.xmlData;
                const apiEndpoint = parsedBody.apiEndpoint;

                if (!xmlData || !apiEndpoint) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Bad Request: Missing xmlData or apiEndpoint');
                    return;
                }

                let externalResponse = await axios.post(apiEndpoint, xmlData, {
                    headers: {
                        'Content-Type': 'application/xml'
                    }
                });

                res.writeHead(200, { 'Content-Type': 'application/xml' });
                res.end(externalResponse.data);

            } catch (error) {
                if (error.response) {
                    // 外部APIからのエラーレスポンスをそのまま返す
                    res.writeHead(error.response.status, { 'Content-Type': 'application/xml' });
                    res.end(error.response.data);
                } else {
                    // 予期しないエラーが発生した場合
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('予期しないエラーが生じました。');
                }
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
