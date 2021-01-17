module.exports = () => {
    if (!localStorage.user) {
        return false;
    }

    const { roles } = JSON.parse(localStorage.user);

    return roles.find(role => role.name === 'admin');
};
