// https://docs.cypress.io/api/introduction/api.html

describe('Chcek if the item exist', () => {
    it('Visits the Login page', () => {
        cy.visit('/');
        cy.contains('h1', 'Login');
    });
});

describe('Login to ERP-System', () => {
    it('trying to LOGIN with correct credentials', () => {
        cy.visit('/login');

        cy.get('#email')
            .parents('.v-input')
            .type('admin@erpsystem.test');

        cy.get('#password')
            .parents('.v-input')
            .type('password');

        cy.get('.v-card button').click();
        cy.url().should('contain', '/home');
    });

    it('Trying to LOGIN with incorrect credentials', () => {
        cy.visit('/login');

        cy.get('#email')
            .parents('.v-input')
            .type('admin@unknown.pl');

        cy.get('#password')
            .parents('.v-input')
            .type('supertajnehaslo');

        cy.get('.v-card button').click();

        cy.contains('.v-alert__content', 'Invalid credentials!');
    });
});

describe('Login to ERP-System', () => {});

describe('Redirect to LOGIN page when user is not logged', () => {
    it('redirect to LOGIN page when visiting HOME page', () => {
        cy.visit('/home');
        cy.url().should('contain', '/login');
    });

    it('redirect to LOGIN page when visiting EMPLOYEES page', () => {
        cy.visit('/employees');
        cy.url().should('contain', '/login');
    });

    it('redirect to LOGIN page when visiting CONTRACTS page', () => {
        cy.visit('/contracts');
        cy.url().should('contain', '/login');
    });

    it('redirect to LOGIN page when visiting VACATIONS page', () => {
        cy.visit('/vacations');
        cy.url().should('contain', '/login');
    });
});

describe('Login and create user as ADMIN', () => {
    beforeAll(() => {
        cy.visit('/login');

        cy.get('#email').type('admin@erpsystem.test');

        cy.get('#password').type('password');

        cy.get('.v-card button').click();

        cy.wait(1000);
    });

    it('Createing employee with correct data', () => {
        cy.visit('/employees');

        cy.get('.v-btn--contained').click();
        cy.wait(500);

        cy.get('#firstName').type('Tomasz');
        cy.get('#lastName').type('Nowak');
        cy.get('#email').type('name@wp.pl');
        cy.get('#password').type('password');
        cy.get('#dayOfBirth').type('1997-09-18');
        cy.get('#submit').click();
    });

    it('Createing employee with incorrect data', () => {
        cy.visit('/employees');

        cy.get('.v-btn--contained').click();
        cy.wait(500);

        cy.get('#firstName')
            .clear()
            .blur()
            .parents('.v-input')
            .contains('.v-messages__message', 'First name is required');

        cy.get('#lastName')
            .clear()
            .blur()
            .parents('.v-input')
            .contains('.v-messages__message', 'Last name is required');

        cy.get('#email')
            .type('mm')
            .parents('.v-input')
            .contains('.v-messages__message', 'Must be valid e-mail');

        cy.get('#password')
            .type('mm')
            .parents('.v-input')
            .contains('Password must be 6-32 characters in length');

        cy.get('#dayOfBirth')
            .clear()
            .blur()
            .parents('.v-input')
            .contains('.v-messages__message', 'Day of birth is required');

        cy.get('#submit').should('be.disabled');
    });
});

describe('Deleting created employee as ADMIN', () => {
    beforeAll(() => {
        cy.visit('/login');

        cy.get('#email').type('admin@erpsystem.test');

        cy.get('#password').type('password');

        cy.get('.v-card button').click();

        cy.wait(1000);
    });

    it('Createing employee with correct data', () => {
        cy.visit('/employees');

        cy.get('.v-btn--contained').click();
        cy.wait(500);
    });
});
