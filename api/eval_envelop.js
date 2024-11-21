import axios from 'axios';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Preflight request. Reply successfully:
        res.status(200).send('OK');
        return;
    }

    else if (req.method === 'POST') {
        try {
            const { xmlData, apiEndpoint } = req.body;

            if (!xmlData || !apiEndpoint) {
                res.status(400).send('Bad Request: Missing xmlData or apiEndpoint');
                return;
            }

            // 外部APIにPOSTリクエストを送信
            const externalResponse = await axios.post(apiEndpoint, xmlData, {
                headers: {
                    'Content-Type': 'application/xml',
                },
            });

            res.status(200).setHeader('Content-Type', 'application/xml').send(externalResponse.data);
        } catch (error) {
            if (error.response) {
                // 外部APIからのエラーレスポンスをそのまま返す
                res.status(error.response.status).setHeader('Content-Type', 'application/xml').send(error.response.data);
            } else {
                // 予期しないエラーが発生した場合
                res.status(500).send('予期しないエラーが生じました。');
            }
        }
    } 
    
    else if (req.method === 'GET') {
        res.status(200).send('API is working. Use POST for actual functionality.');
        return;
    }
    
    else {
        res.status(404).send('Not Found');
    }
}
