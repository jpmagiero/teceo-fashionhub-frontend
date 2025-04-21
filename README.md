# Fashion Hub - Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

Aplicação front-end para gerenciamento de peças de roupa e acessórios, desenvolvida em React utilizando Material UI e seguindo as práticas da Clean Architecture.

## Tecnologias Utilizadas

- **React 19**: Framework JavaScript para construção de interfaces
- **TypeScript**: Superset de JavaScript com tipagem estática
- **Vite**: Build tool e dev server para desenvolvimento rápido
- **Material UI 7**: Biblioteca de componentes React
- **Axios**: Cliente HTTP para requisições à API
- **React Virtuoso**: Biblioteca para virtualização de listas e tabelas
- **ESLint**: Ferramenta de linting para código JavaScript/TypeScript

## Pré-requisitos

- Node.js 18+ (recomendado última versão LTS)
- npm ou yarn

## Configuração

1. Clone o repositório:

   ```bash
   git clone
   cd teceo-fashionhub-frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente:

   Caso o back-end esteja rodando em uma porta diferente da localhost:3000, crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```
   VITE_API_URL=http://localhost:3000
   ```

   Ajuste a URL conforme a localização da sua API backend.

## Executando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## Referências e Documentação

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [React Virtuoso](https://virtuoso.dev/)
