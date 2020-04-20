// JSON Web Token
const jwt = require('jsonwebtoken');

//===========================
//Verificar token
//===========================

// next ejecuta la continuación del programa, si no se llama el next en está parte de la lógica muere el programa
let verificaToken = (req, res, next) => {

    // Para usar header, req es por que está en la petición nombre del header 'token'
    let token = req.get('token'); //token

    // Verificando si el token es válido
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            // Error 401, desautorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Autenticación inválida'
                }
            });
        }

        // Dentro del objeto encryptado, viene el usuario (Payload)
        req.usuario = decoded.usuario;
        next();

    });
};

// Para funciones el export es asi
module.exports = {
    verificaToken
}