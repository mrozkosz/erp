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
                            <h1>Recover password</h1>
                        </v-col>

                        <v-form v-model="isValid" ref="loginForm">
                            <v-col cols="10" class="offset-md-1">
                                <v-text-field
                                    class="centered-input text--darken-3 mt-3"
                                    v-model="credentials.password"
                                    label="Password"
                                    type="password"
                                    required
                                    :rules="passwordValidator"
                                    rounded
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>

                            <v-col cols="10" class="offset-md-1">
                                <v-text-field
                                    class="centered-input text--darken-3 mt-3"
                                    v-model="credentials.passwordRepeat"
                                    label="Confirm Password"
                                    type="password"
                                    required
                                    :rules="passwordRepeatValidator"
                                    rounded
                                    dense
                                    outlined
                                ></v-text-field>
                            </v-col>

                            <v-card-actions>
                                <v-spacer />
                                <div class="my-2">
                                    <v-btn
                                        depressed
                                        large
                                        color="primary"
                                        :disabled="!isValid"
                                        @click="recover"
                                        >Recover</v-btn
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
    sameAs
} from 'vuelidate/lib/validators';

export default {
    name: 'LoginPage',

    mixins: [validationMixin],

    validations: {
        credentials: {
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(50)
            },
            passwordRepeat: { required, sameAsPassword: sameAs('password') }
        }
    },

    data() {
        return {
            credentials: {
                hash: this.$route.params.hash,
                password: '',
                passwordRepeat: ''
            },
            serverErrors: {
                password: []
            },

            isValid: false,
            errorMessage: ''
        };
    },

    computed: {
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
        },

        passwordRepeatValidator() {
            const errors = [];
            const { passwordRepeat } = this.$v.credentials;

            if (!passwordRepeat.sameAsPassword) {
                errors.push('Passwords must be the same');
            }

            return errors;
        }
    },

    methods: {
        async recover() {
            try {
                await Auth.recoverPassword({ ...this.credentials });

                this.$router.push({ name: 'login' });
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
