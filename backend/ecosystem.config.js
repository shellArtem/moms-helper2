module.exports = {
    apps : [{
      name   : "moms-helper-backend", // Более осмысленное имя для вашего приложения
      script : "./backend/server.js", // Путь к server.js относительно корня moms-helper2
      env_file: "./backend/.env",     // Путь к .env файлу, если он находится в папке backend
      // Если .env файл находится в корне moms-helper2, то env_file: ".env",
      // Более специфичные переменные окружения, если нужно переопределить
      // env: {
      //   "NODE_ENV": "development",
      //   "PORT": 3001
      // },
      // env_production: {
      //   "NODE_ENV": "production",
      // }
    }]
  };