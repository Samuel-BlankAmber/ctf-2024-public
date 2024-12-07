const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const forge = require('node-forge');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const port = 3000;

const FLAG = "FLAG{REDACTED}";

const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair({ bits: 2048 });

const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation with Swagger and Express',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Verify a JWT token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid token
 */
app.get('/api/auth', (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { username, isAdmin } = jwt.verify(token, publicKeyPem);
    if (isAdmin) {
      res.json({ message: `Welcome admin: ${FLAG}` });
    } else {
      res.json({ message: `Welcome ${username}` });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

/**
 * Generates a JSON Web Token (JWT) for a user.
 *
 * @param {string} username - The username of the user.
 * @returns {string} The generated JWT token.
 *
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Generate a JWT token for a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Successfully generated JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post('/api/auth', (req, res) => {
  console.log("Generating token for user: " + req.body.username);
  const { username } = req.body;
  const token = jwt.sign({ username, isAdmin: false }, privateKeyPem, { algorithm: 'RS256' });
  res.json(token);
});

/**
 * @swagger
 * /api/publickey:
 *   get:
 *     summary: Retrieve the public key
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: The public key in PEM format
 *         schema:
 *           type: string
 */
app.get('/api/publickey', (req, res) => {
  res.send(JSON.stringify(publicKeyPem));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
