## 🧾 Waving Test – Frontend

[![Deploy](https://vercelbadge.vercel.app/api/brunog2/waving-test-front)](https://waving-test-front.vercel.app)

Aplicação frontend do desafio técnico da Waving, desenvolvida com **Next.js**, **TailwindCSS** e **React Query**, consumindo a [API NestJS](https://github.com/brunog2/waving-test-api).

🔗 **Acesse em produção:** [https://waving-test-front.vercel.app](https://waving-test-front.vercel.app)
🔗 **Documentação também disponível em:** [https://deepwiki.com/brunog2/waving-test-front](https://deepwiki.com/brunog2/waving-test-front)

---

### ⚙️ Tecnologias

- **[Next.js 14 (App Router)](https://nextjs.org/docs/app)**
- **Tailwind CSS**
- **TypeScript**
- **React Query (TanStack Query)**
- **Zod** – validação de schemas
- **React Hook Form**
- **Axios**
- **Lucide Icons**

---

### 📦 Funcionalidades

#### 🛍️ Cliente

- Cadastro e login
- Home com categorias paginadas e 10 produtos por categoria (scroll infinito)
- Filtros por categoria, preço e disponibilidade
- Carrinho com persistência
- Finalização de pedido
- Comentários e avaliações de produtos
- Histórico de pedidos

#### 🛠️ Admin

- Login separado
- Listagem de pedidos com filtro por usuário
- CRUD de produtos e categorias

---

### 📁 Estrutura de pastas

```
.
├── app/                # Rotas (Next.js App Router)
├── components/         # Componentes reutilizáveis
├── contexts/           # Contextos da aplicação
├── hooks/              # Custom hooks
├── services/           # Serviços intermediários
├── lib/                # Configuração de API, auth e utils
├── types/              # Tipagens globais
├── constants.ts        # Enums e valores fixos
```

---

### ✅ Diferenciais técnicos implementados

#### 🧠 Arquitetura limpa e escalável

- Separação clara por domínio com modularização
- Utilização de `React Query` + `Zod` para consistência entre validação e consumo de API
- Requisições encapsuladas em funções puras (`lib/api.ts`)
- Proteção de rotas baseada em `role` com hook `useAuthGuard`

#### 🔁 Experiência de usuário

- Scroll infinito na home para categorias com produtos
- Feedback de loading, erros e estados vazios bem tratados
- Formulários 100% reativos e tipados
- Filtro com debounce e suporte a acentuação normalizada (ex: “maquina” busca “máquina”)

#### 🎯 Performance

- Uso de `select` no backend e frontend para limitar payload
- Layouts reutilizados para minimizar recarregamentos
- Deploy contínuo com preview automático no Vercel

---

### 🛠️ Como rodar localmente

```bash
git clone https://github.com/brunog2/waving-test-front.git
cd waving-test-front

npm install

# Configure o backend URL
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

npm run dev
```

---

### 🧪 Testes

> Testes não foram implementados neste desafio por limitação de tempo, mas a estrutura do projeto permite fácil integração com **Jest** e **Testing Library**.

---

### 🔐 Autenticação

- Armazenamento de JWT no `localStorage`
- Proteção de rotas por role (`ADMIN`, `CUSTOMER`)
- Redirecionamento automático baseado em sessão

---

### 📈 Considerações finais

Este projeto foi desenvolvido com foco em:

- Clareza de código e arquitetura
- Reutilização de componentes
- Aderência a boas práticas modernas de frontend (tipo-safe forms, consumo declarativo de dados, modularização por feature)
- Equilíbrio entre escopo do desafio e qualidade de entrega
