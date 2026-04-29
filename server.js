const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000; 

// Сообщение о том, что сервер запущен и прослушивает указанный порт 
app.listen(port, () => console.log(`Listening on port ${port}`));
