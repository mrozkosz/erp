<template>
    <v-container fill-height>
        <v-col cols="10" class="offset-sm-1">
            <v-alert
                text
                border="left"
                light
                color="red"
                type="error"
                v-if="errorMessage.length"
                >{{ errorMessage }}</v-alert
            >

            <v-card outlined>
                <v-row no-gutters>
                    <v-col class="d-none d-sm-flex">
                        <v-img
                            src="https://picsum.photos/380/500?random"
                            aspect-ratio="2"
                            height="500"
                        ></v-img>
                    </v-col>

                    <v-col>
                        <v-col cols="10">
                            <h1>Login</h1>
                        </v-col>

                        <v-form v-model="isValid" ref="loginForm">
                            <v-col cols="10" class="offset-md-1">
                                <v-text-field
                                    v-model="credentials.email"
                                    id="email"
                                    label="E-mail"
                                    type="email"
                                    required
                                    :rules="emailValidator"
                                    rounded
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>

                            <v-col cols="10" class="offset-md-1">
                                <v-text-field
                                    class="centered-input text--darken-3 mt-3"
                                    v-model="credentials.password"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    required
                                    :rules="passwordValidator"
                                    rounded
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>

                            <v-col cols="10">
                                <router-link to="recover-password">
                                    <p class="font-weight-thin text-start"
                                        >Recover password.</p
                                    >
                                </router-link>
                            </v-col>
                            <v-card-actions>
                                <v-spacer />
                                <div class="my-2">
                                    <v-btn
                                        id="submit"
                                        depressed
                                        large
                                        color="primary"
                                        :disabled="!isValid"
                                        @click="login"
                                        >Login</v-btn
                                    >
                                </div>
                                <v-spacer />
                            </v-card-actions>
                        </v-form>
                    </v-col>
                    <v-responsive width="100%"></v-responsive>
                </v-row>
            </v-card>
        </v-col>
    </v-container>
</template>

<script>
import Auth from '../services/Auth';
import { validationMixin } from 'vuelidate';
import {
    required,
    minLength,
    maxLength,
    email
} from 'vuelidate/lib/validators';
import { mapActions } from 'vuex';

export default {
    name: 'LoginPage',

    mixins: [validationMixin],

    validations: {
        credentials: {
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(50)
            }
        }
    },

    data() {
        return {
            credentials: {
                email: '',
                password: ''
            },
            serverErrors: {
                email: [],
                password: []
            },

            isValid: false,
            errorMessage: ''
        };
    },

    computed: {
        emailValidator() {
            const errors = [];
            const email = this.$v.credentials.email;

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
            const password = this.$v.credentials.password;

            if (!password.minLength || !password.maxLength) {
                errors.push('Password must be 6-32 characters in length');
            }

            if (!password.required) {
                errors.push('Password is required');
            }

            return errors;
        }
    },

    methods: {
        ...mapActions(['setUser']),
        async login() {
            try {
                const data = await Auth.login({ ...this.credentials });

                this.setUser(data);

                this.$router.push({ name: 'home' });
            } catch (error) {
                this.$notify({
                    group: 'msg',
                    type: 'error',
                    title: 'Sign in',
                    text: 'There were some problems ...'
                });

                if (error.response) {
                    this.errorMessage = 'Invalid credentials!';
                }
            }
        }
    }
};
</script>
