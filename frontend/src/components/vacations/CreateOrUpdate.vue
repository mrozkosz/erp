<template>
    <v-row justify="center">
        <v-dialog v-model="isVisible" persistent max-width="600px">
            <v-card>
                <v-alert
                    text
                    border="left"
                    light
                    color="red"
                    type="error"
                    v-if="errorMessage.length"
                >{{ errorMessage }}</v-alert>
                <v-form v-model="isValid">
                    <v-card-title>
                        <span class="headline">
                            {{
                            vacationDay.id ? 'Edit Vacation Request': 'Create Vacation Request'
                            }}
                        </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col v-if="!vacationDay.id" cols="12">
                                    <v-autocomplete
                                        v-if="isAdmin"
                                        v-model="formData.userId"
                                        :items="searchResult"
                                        filled
                                        chips
                                        color="blue-grey lighten-2"
                                        label="Email"
                                        item-text="email"
                                        item-value="id"
                                        :rules="userValidator"
                                        :search-input.sync="params.q"
                                        @keyup="search"
                                    >
                                        <template v-slot:selection="data">
                                            <template>
                                                <v-list-item-content>
                                                    {{ data.item.firstName }}
                                                    {{ data.item.lastName }}
                                                </v-list-item-content>
                                            </template>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="formData.startDay"
                                        label="Vacations start at..."
                                        value="12:30:00"
                                        type="date"
                                        :rules="startDayValidator"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="formData.stopDay"
                                        label="Vacations stop at..."
                                        value="12:30:00"
                                        type="date"
                                        :rules="stopDayValidator"
                                    />
                                </v-col>

                                <v-col v-if="vacationDay.id" cols="12" sm="12">
                                    <v-switch
                                        v-if="isAdmin"
                                        v-model="formData.isApproved"
                                        inset
                                        :label="
                                            `This holidays has ${
                                                formData.isApproved
                                                    ? 'been approved'
                                                    : 'not been approved'
                                            }`
                                        "
                                    ></v-switch>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="blue darken-1" text @click="onCloseDialog">Close</v-btn>
                        <v-btn color="blue darken-1" text :disabled="!isValid" @click="onSave">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';
import VacationDaysService from '@/services/VacationDaysService';

export default {
    props: {
        isVisible: Boolean,
        vacationDay: Object
    },
    mixins: [validationMixin],
    validations: {
        formData: {
            userId: { required },
            startDay: { required },
            stopDay: { required }
        }
    },
    data() {
        return {
            formData: {},
            defaultFormData: {
                id: '',
                userId: '',
                startDay: '',
                stopDay: '',
                isApproved: false
            },
            searchResult: [],
            isValid: false,
            errorMessage: '',
            params: {
                q: ''
            }
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin',
            isEmployee: 'isEmployee',
            user: 'getUser',
            employees: 'employees'
        }),

        userValidator() {
            const errors = [];
            const userId = this.$v.formData.userId;
            if (!userId.required) {
                errors.push('User is required');
            }
            return errors;
        },

        startDayValidator() {
            const errors = [];
            const startDay = this.$v.formData.startDay;
            if (!startDay.required) {
                errors.push('This day is required');
            }
            return errors;
        },

        stopDayValidator() {
            const errors = [];
            const stopDay = this.$v.formData.stopDay;
            if (!stopDay.required) {
                errors.push('This day is required');
            }
            return errors;
        }
    },

    watch: {
        vacationDay() {
            if (this.vacationDay.id) {
                this.formData = this.vacationDay;
            } else {
                this.formData = { ...this.defaultFormData };
                this.formData.userId = this.user.id;
            }
        }
    },

    methods: {
        ...mapActions(['getEmployees']),

        search() {
            this.getEmployees({ ...this.params });

            this.searchResult = this.employees.data;
        },

        async onSave() {
            try {
                const { data } = await VacationDaysService.save(this.formData);

                if (!this.vacationDay.id) {
                    this.$emit('pushNewItem', data);
                } else {
                    this.$emit('updateItem', data);
                }

                this.onCloseDialog();

                this.$emit('showAlert');
            } catch (error) {
                console.error(error);

                if (error.response) {
                    this.errorMessage = 'Check if you have a contract';
                }
            }
        },

        onCloseDialog() {
            this.$v.$reset();

            this.$emit('onCloseDialog', false);
        }
    }
};
</script>
