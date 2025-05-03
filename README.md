<h1>🐺 FURIA – Know Your Fan</h1>

<p>Aplicação web interativa para torcedores da FURIA realizarem login, atualizarem seus dados de perfil, enviarem documentos e, no caso de administradores, acessarem um dashboard completo com informações dos usuários. Um verdadeiro <em>hub</em> para os fãs se conectarem ainda mais com seu time do coração.</p>

<h2>🔗 Link do projeto</h2>
<p><a href="https://furia-know-your-fan-mu.vercel.app/login">Acesse aqui</a></p>

<h2>📸 Screenshot da aplicação</h2>
<p><em>[Adicione aqui uma imagem ou gif da interface]</em></p>

<h2>🎯 Objetivo</h2>
<p>Oferecer uma plataforma personalizada e segura para fãs da FURIA se cadastrarem, interagirem e manterem seu perfil atualizado, enquanto a equipe de administração pode visualizar e gerenciar todas as informações por meio de um dashboard moderno e dinâmico.</p>

<h2>🚀 Funcionalidades</h2>
<ul>
  <li>🔐 Autenticação de usuários com dados salvos em banco PostgreSQL</li>
  <li>🧾 Edição de perfil com:
    <ul>
      <li>Nome completo</li>
      <li>Endereço</li>
      <li>Jogos de interesse</li>
      <li>Times favoritos da FURIA</li>
    </ul>
  </li>
  <li>📤 Upload e verificação de documentos pessoais</li>
  <li>🧑‍💼 Acesso exclusivo para <strong>admin</strong> com:
    <ul>
      <li>Visualização completa dos dados dos usuários</li>
      <li>Dashboard interativo e animado com estatísticas gerais</li>
    </ul>
  </li>
  <li>📱 Interface moderna e responsiva para qualquer dispositivo</li>
  <li>⚙️ Backend integrado para persistência e segurança dos dados</li>
</ul>

<h2>🧑‍💻 Tecnologias utilizadas</h2>
<ul>
  <li><strong>React</strong> — Biblioteca para construção de interfaces modernas</li>
  <li><strong>Vite</strong> — Ambiente de build e desenvolvimento ultrarrápido</li>
  <li><strong>TypeScript</strong> — Tipagem estática para código mais seguro e escalável</li>
  <li><strong>Tailwind CSS</strong> — Estilização rápida e responsiva com classes utilitárias</li>
  <li><strong>PostgreSQL</strong> — Banco de dados relacional robusto</li>
  <li><strong>Firebase Auth + JWT</strong> — Autenticação segura</li>
  <li><strong>Drizzle ORM</strong> — Abstração SQL moderna e tipada</li>
</ul>

<h2>📦 Como rodar o projeto</h2>

<h3>🖥️ Frontend</h3>
<pre><code># Clone o repositório
git clone https://github.com/seu-usuario/furia-know-your-fan.git

# Acesse a pasta do frontend
cd furia-know-your-fan/frontend

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev

# O app estará disponível em:
http://localhost:5000
</code></pre>

<h3>🛠️ Backend (Express + Node)</h3>
<pre><code># Acesse a pasta do backend
cd furia-know-your-fan/backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)

# Inicie o servidor
npm run dev

# O backend estará disponível em:
http://localhost:3000
</code></pre>

<h2>📄 Considerações</h2>
<ul>
  <li>O acesso ao dashboard está restrito a usuários com permissão de administrador.</li>
  <li>A autenticação utiliza <strong>JWT</strong> armazenado no <code>localStorage</code> para sessões seguras sem uso de cookies.</li>
  <li>O upload de documentos é opcional, mas pode ser necessário para validação de campanhas exclusivas.</li>
  <li>A aplicação foi idealizada para estreitar a relação entre a torcida e a equipe FURIA, com uma proposta moderna, funcional e segura.</li>
  <li>A aplicação foi feita para o Challenge #2: Know Your Fan </li>
</ul>

<p>💻 Feito com 💙 por Erick de Castro Souza</p>
