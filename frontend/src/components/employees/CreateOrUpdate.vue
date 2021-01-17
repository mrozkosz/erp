<template>
    <v-row justify="center">
        <v-dialog v-model="isVisible" persistent max-width="600px">
            <v-card>
                <v-form v-model="isValid">
                    <v-card-title>
                        <span class="headline">
                            {{
                                employee.id
                                    ? 'Edit employee'
                                    : 'Create new employee'
                            }}
                        </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="formData.firstName"
                                        id="firstName"
                                        label="First name"
                                        :rules="firstNameValidator"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field
                                        v-model="formData.lastName"
                                        id="lastName"
                                        label="Last name"
                                        :rules="lastNameValidator"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="formData.email"
                                        id="email"
                                        label="Email"
                                        :rules="emailValidator"
                                        required
                                    />
                                </v-col>
                                <v-col v-if="!employee.id" cols="12">
                                    <v-text-field
                                        v-model="formData.password"
                                        id="password"
                                        label="Password"
                                        type="password"
                                        :disabled="employee.id"
                                        :rules="passwordValidator"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="formData.dayOfBirth"
                                        id="dayOfBirth"
                                        label="Date of birth"
                                        value="12:30:00"
                                        type="date"
                                        :rules="dayOfBirthValidator"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="onCloseDialog"
                            >Close</v-btn
                        >
                        <v-btn
                            id="submit"
                            color="blue darken-1"
                            text
                            :disabled="!isValid"
                            @click="onSave"
                            >Save</v-btn
                        >
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
    required,
    email,
    minLength,
    maxLength
} from 'vuelidate/lib/validators';
import EmployeesService from '@/services/EmployeesService';

export default {
    props: {
        isVisible: Boolean,
        employee: Object
    },

    mixins: [validationMixin],

    validations: {
        formData: {
            firstName: { required },
            lastName: { required },
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(50)
            },
            dayOfBirth: { required }
        }
    },

    data() {
        return {
            formData: {},
            defaultFormData: {
                id: '',
                email: '',
                firstName: '',
                lastName: '',
                password: ''
            },
            isValid: false,
            errorMessage: ''
        };
    },

    computed: {
        employees() {
            return this.$store.state.employees;
        },

        firstNameValidator() {
            const errors = [];
            const firstName = this.$v.formData.firstName;

            if (!firstName.required) {
                errors.push('First name is required');
            }

            return errors;
        },

        lastNameValidator() {
            const errors = [];
            const lastName = this.$v.formData.lastName;

            if (!lastName.required) {
                errors.push('Last name is required');
            }

            return errors;
        },

        emailValidator() {
            const errors = [];
            const email = this.$v.formData.email;

            if (!email.email) {
                errors.push('Must be valid e-mail');
            }

            if (!email.required) {
                errors.push('E-mail is required');
            }

            return errors;
        },

        passwordValidator() {
            const errors = [];
            const password = this.$v.formData.password;

            if (!password.minLength || !password.maxLength) {
                errors.push('Password must be 6-32 characters in length');
            }

            if (!password.required) {
                errors.push('Password is required');
            }

            return errors;
        },

        dayOfBirthValidator() {
            const errors = [];
            const dayOfBirth = this.$v.formData.dayOfBirth;

            if (!dayOfBirth.required) {
                errors.push('Day of birth is required');
            }

            return errors;
        }
    },

    watch: {
        employee() {
            if (this.employee.id) {
                this.formData = this.employee;
            } else {
                this.formData = { ...this.defaultFormData };
            }
        }
    },

    methods: {
        async onSave() {
            try {
                const { data } = await EmployeesService.save(this.formData);

                if (!this.employee.id) {
                    this.$emit('pushNewEmployee', data);
                }

                this.onCloseDialog();

                this.$emit('showAlert');
            } catch (error) {
                console.error(error);
            }
        },

        onCloseDialog() {
            this.$v.$reset();

            this.$emit('onCloseDialog', false);
        }
    }
};
</script>
