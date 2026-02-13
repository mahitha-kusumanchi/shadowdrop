const { AccessControl } = require('accesscontrol');

const ac = new AccessControl();

// Define Roles and Resources (Access Control Matrix)
ac.grant('Auditor')
    .readAny('report')
    .readAny('log');

ac.grant('Investigator')
    .extend('Auditor')
    .updateAny('report', ['status', 'notes']) // Can update status
    .readAny('user');

ac.grant('SuperAdmin')
    .extend('Investigator')
    .createAny('user')
    .updateAny('user')
    .deleteAny('user')
    .deleteAny('report')
    .readAny('system');

exports.roles = ac;

exports.checkRole = (action, resource) => {
    return (req, res, next) => {
        try {
            const permission = ac.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action"
                });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid Role Permission Check" });
        }
    };
};
