const jwt = require('jsonwebtoken');
//Verificar Token


let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                exito: true,
                error: err,
                mensaje: "Token inválido."
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verificaAdminRole = (req, res, next) => {
    let role = req.usuario.role;
    let id = req.params.id;

    if (id === req.usuario._id) {
        next();
    } else {
        if (role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                exito: true,
                mensaje: "Sin permisos suficientes."
            });
        } else {
            next();
        }
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}