module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            dayOfBirth: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false
            },
            availableDays: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            defaultScope: {
                attributes: {
                    exclude: ['password', 'dayOfBirth']
                }
            }
        }
    );

    User.associate = (db) => {
        User.belongsToMany(db.Role, {
            as: 'roles',
            through: 'UserRoles',
            foreignKey: 'userId',
            otherKey: 'roleId',
            onDelete: 'cascade'
        });

        User.hasMany(db.Contract, {
            as: 'contracts',
            foreignKey: 'userId'
        });

        User.hasMany(db.RecoverPassword, {
            as: 'recoverPasswords'
        });
    };

    const Role = sequelize.import('./Role');

    User.prototype.isEmployee = async function () {
        const roles = await this.getRoles();

        return roles.some((role) => role.name === Role.ROLE_EMPLOYEE);
    };

    User.prototype.isAdmin = async function () {
        const roles = await this.getRoles();

        return roles.some((role) => role.name === Role.ROLE_ADMIN);
    };

    return User;
};
