/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ajustando o 'content' para a sua estrutura de pastas:
  content: [
    "./index.html",      // Encontra o index.html na raiz
    "./assets/**/*.{html,js}", // Encontra arquivos .html e .js dentro da pasta assets
  ],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif'], // Adicionando a fonte Poppins
    },
    extend: {backgroundImage: {
      "home": "url('../assets/bg.png')",
    },
  },
  plugins: [],
  },
}