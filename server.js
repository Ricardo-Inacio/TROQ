// Importa as bibliotecas que acabamos de instalar
const express = require('express');
const fs = require('fs'); // Módulo para interagir com o sistema de arquivos
const bcrypt = require('bcrypt');
const path = require('path'); // Módulo para lidar com caminhos de arquivos

// Inicializa o aplicativo Express
const app = express();
const PORT = 3001; // A porta onde nosso servidor vai rodar

// Middleware para o servidor entender JSON e servir arquivos estáticos da pasta 'public'
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbFilePath = path.join(__dirname, 'database.json');

// Função para ler os dados do banco de dados
const readData = () => {
    try {
        if (!fs.existsSync(dbFilePath)) {
            fs.writeFileSync(dbFilePath, JSON.stringify({ users: [], offers: [] }, null, 2)); // Cria o arquivo se ele não existir
        }
        const data = fs.readFileSync(dbFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler o banco de dados:", error);
        return { users: [], offers: [] }; // Se der erro, retorna estrutura vazia
    }
};

// Função para salvar os dados no banco de dados
const writeData = (data) => {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// ROTA DE CADASTRO (POST /register)
app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const data = readData();
    const users = data.users;

    if (users.find(user => user.email === email)) {
        return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now().toString(),
        fullname,
        email,
        password: hashedPassword
    };

    users.push(newUser);
    writeData(data);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// ROTA DE LOGIN (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const data = readData();
    const users = data.users;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    res.status(200).json({ message: `Login bem-sucedido! Bem-vindo(a), ${user.fullname}!` });
});

// Rota para a página inicial, que redireciona para o dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Rota para o dashboard
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
