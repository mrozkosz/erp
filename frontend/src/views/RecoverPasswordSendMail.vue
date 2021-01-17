<template>
    <v-container fill-height>
        <v-col cols="10" class="offset-sm-1">
            <v-overlay
                :absolute="boxOverlay.absolute"
                :value="boxOverlay.overlay"
            >
                <sweetalert-icon icon="success" />
                <div class="white--text mb-2">
                    Email with a link to recover password has been sent.
                </div>
            </v-overlay>
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
                                    v-model="email"
                                    label="E-mail"
                                    type="email"
                                    required
                                    :rules="emailValidator"
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
import { required, email } from 'vuelidate/lib/validators';
import SweetalertIcon from 'vue-sweetalert-icons';

export default {
    name: 'LoginPage',

    components: { SweetalertIcon },

    mixins: [validationMixin],

    validations: {
        email: { required, email }
    },

    data() {
        return {
            boxOverlay: {
                absolute: false,
                overlay: false,
                zIndex: 5
            },
            email: '',

            serverErrors: {
                email: []
            },

            isValid: false,
            errorMessage: ''
        };
    },

    computed: {
        emailValidator() {
            const errors = [];
            const email = this.$v.email;

            if (!email.email) {
                errors.push('Must be valid e-mail');
            }

            if (!email.required) {
                errors.push('E-mail is required');
            }

            return errors;
        }
    },
    methods: {
        async recover() {
            try {
                const { status } = await Auth.recoverPasswordSendEmail({
                    email: this.email
                });

                if (status === 204) {
                    this.boxOverlay.absolute = true;
                    this.boxOverlay.overlay = true;
                }
            } catch (error) {
                this.$notify({
                    group: 'msg',
                    type: 'error',
                    title: 'Sign in',
                    text: 'There were some problems ...'
                });

                if (error.response) {
                    this.errorMessage = 'Invalid email!';
                }
            }
        }
    }
};
</script>
