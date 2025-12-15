🎟️ Frontend – Ticket Management App (Parque Explora)

Este repositorio contiene el frontend de la aplicación generadora y gestora de tickets desarrollada como parte de la Prueba Técnica – Parque Explora.

La aplicación permite a los usuarios:

Autenticarse en el sistema

Crear y consultar tickets

Acceder a un panel administrativo (usuarios con rol Admin)

Gestionar tickets y usuarios desde el frontend

El frontend se comunica con una API REST serverless desplegada en AWS.

🧱 Arquitectura

Framework: Next.js

Tipo de aplicación: Frontend desacoplado

Despliegue: Amazon S3 (Static Website Hosting)

Consumo de API: Amazon API Gateway + AWS Lambda

La solución sigue una arquitectura serverless, separando completamente frontend y backend.

🚀 URL de la aplicación

👉 Aplicación desplegada:
http://front-tickets-project.s3-website.us-east-2.amazonaws.com

🔌 Backend (API)

El frontend consume una API REST desplegada en AWS:

👉 API Base URL:
https://rk7smql7xc.execute-api.us-east-2.amazonaws.com

⚙️ Instalación y ejecución local

Clonar el repositorio:

git clone https://github.com/nicoguaro20/frontTicketsProject.git


Instalar dependencias:

npm install


Ejecutar en modo desarrollo:

npm run dev


La aplicación estará disponible en:

http://localhost:3000

🏗️ Build para producción

Para generar la versión estática del proyecto:

npm run build


El resultado se genera en la carpeta:

/out


Esta carpeta es la utilizada para el despliegue en Amazon S3.

📌 Notas

El frontend está diseñado para trabajar con una API REST externa.

Las rutas y permisos dependen del rol del usuario autenticado.

La aplicación fue desarrollada como parte de una prueba técnica, priorizando claridad, arquitectura y buenas prácticas.

👤 Autor

Juan Nicolás García Guarín
📧 jungarciagu@unal.edu.co