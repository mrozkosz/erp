<template>
    <v-row justify="center">
        <v-dialog v-model="isVisible" persistent max-width="600px">
            <v-card>
                <v-form v-model="isValid">
                    <v-card-title>
                        <span class="headline">
                            {{
                            contract.id ? 'Edit contract': 'Create new contract'
                            }}
                        </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col v-if="!contract.id" cols="12">
                                    <v-autocomplete
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
                                        label="Contract start at"
                                        value="12:30:00"
                                        type="date"
                                        :rules="startDayValidator"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="formData.stopDay"
                                        label="Contract stop at"
                                        value="12:30:00"
                                        type="date"
                                        disabled
                                        :rules="stopDayValidator"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model="formData.duration"
                                        type="number"
                                        label="Months"
                                        placeholder="Contract ends after ..."
                                        :rules="durationValidator"
                                        @keyup="onDateChange"
                                    />
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-select
                                        v-model="formData.freeDays"
                                        :hint="`${formData.freeDays}`"
                                        :items="['20', '26']"
                                        label="Vacations days"
                                        :role="freeDaysValidator"
                                        persistent-hint
                                        required
                                    />
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
import ContractsService from '@/services/ContractsService';
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'CreateContracts',

    props: {
        isVisible: Boolean,
        userId: Number,
        contract: Object
    },

    mixins: [validationMixin],

    validations: {
        formData: {
            userId: { required },
            startDay: { required },
            stopDay: { required },
            duration: { required },
            freeDays: { required }
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
                duration: '',
                freeDays: ''
            },
            searchResult: [],
            isUpdating: false,
            date: null,
            isValid: false,
            errorMessage: '',
            params: {
                q: ''
            }
        };
    },

    computed: {
        ...mapGetters(['employees']),

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
                errors.push('Start at is required');
            }

            return errors;
        },

        stopDayValidator() {
            const errors = [];
            const stopDay = this.$v.formData.stopDay;

            if (!stopDay.required) {
                errors.push('Stop at is required');
            }

            return errors;
        },

        freeDaysValidator() {
            const errors = [];
            const freeDays = this.$v.formData.freeDays;
            if (!freeDays.required) {
                errors.push('Start at is required');
            }

            return errors;
        },

        durationValidator() {
            const errors = [];
            const duration = this.$v.formData.duration;

            if (!duration.required) {
                errors.push('Duration time is required');
            }

            return errors;
        }
    },

    watch: {
        contract() {
            if (this.contract.id) {
                this.formData = this.contract;
            } else {
                this.formData = { ...this.defaultFormData };
            }
        }
    },

    methods: {
        ...mapActions(['getEmployees']),

        search() {
            this.getEmployees({ ...this.params });

            this.searchResult = this.employees.data;
        },

        onDateChange() {
            const date = moment(this.formData.startDay);
            this.formData.stopDay = moment(date, 'YYYY-MM-DD')
                .add(this.formData.duration, 'month')
                .subtract(1, 'd')
                .format('YYYY-MM-DD');
        },

        async onSave() {
            try {
                const { data } = await ContractsService.save(this.formData);

                if (!this.contract.id) {
                    this.$emit('pushNewContract', data);
                }

                this.onCloseDialog();

                this.$emit('showAlert');
            } catch (error) {
                console.error(error);
            }
        },

        onCloseDialog() {
            this.$emit('onCloseDialog', false);
        }
    }
};
</script>
