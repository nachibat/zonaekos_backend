const jwt = require('jsonwebtoken');

// Verificar token
const verificaToken = (req, res, next) => {
    const token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token was not provided'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

// Verifica ADMIN_ROLE
const verificaAdminRole = (req, res, next) => {
    const usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User doesn\'t have permissons'
            }
        })
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole
}