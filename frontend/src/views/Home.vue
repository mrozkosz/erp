<template>
    <v-container class="grey lighten-5">
        <v-row>
            <v-col v-if="isAdmin" lg="6" cols="sm" class="pb-2">
                <v-card>
                    <v-row class="no-gutters">
                        <div class="col-auto">
                            <div class="cyan fill-height">&nbsp;</div>
                        </div>
                        <div class="col pa-3 py-4 green--text">
                            <h5 class="text-truncate text-uppercase">Employees</h5>
                            <h1>{{ employees.count }}</h1>
                        </div>
                    </v-row>
                </v-card>
            </v-col>
            <v-col lg="6" cols="sm" class="pb-2">
                <v-card>
                    <v-row class="no-gutters">
                        <div class="col-auto">
                            <div class="primary fill-height">&nbsp;</div>
                        </div>
                        <div class="col pa-3 py-4 primary--text">
                            <h5 class="text-truncate text-uppercase">Contracts</h5>
                            <h1>{{contracts.count}}</h1>
                        </div>
                    </v-row>
                </v-card>
            </v-col>

            <v-col v-if="isEmployee" lg="6" cols="sm" class="pb-2">
                <v-card>
                    <v-row class="no-gutters">
                        <div class="col-auto">
                            <div class="primary fill-height">&nbsp;</div>
                        </div>
                        <div class="col pa-3 py-4 green--text">
                            <h5 class="text-truncate text-uppercase">Available days</h5>
                            <h1>{{ employee.availableDays }}</h1>
                        </div>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-card v-if="isEmployee" class="mx-auto text-center">
                    <v-card-title class="primary--text">Your Contracts</v-card-title>
                    <v-data-table
                        :headers="contractsHeaders"
                        :items="contracts.data"
                        :items-per-page="5"
                        class="elevation-1"
                        hide-default-footer
                    >
                        <template v-slot:item.availableDays="{ item }">{{availableDays(item)}}</template>
                    </v-data-table>
                </v-card>

                <v-card v-if="isAdmin" class="mx-auto text-center">
                    <v-card-title class="primary--text">Users</v-card-title>

                    <v-data-table
                        :headers="employeesHeaders"
                        :items="employees.data"
                        :items-per-page="5"
                        class="elevation-1"
                        hide-default-footer
                    ></v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'HomePage',

    data() {
        return {
            contractsHeaders: [
                {
                    text: 'id',
                    sortable: true,
                    value: 'id'
                },
                { text: 'Start at', value: 'startDay' },
                { text: 'Stop at', value: 'stopDay' },

                { text: 'Available Days per contract', value: 'availableDays' }
            ],
            employeesHeaders: [
                {
                    text: 'id',
                    sortable: true,
                    value: 'id'
                },
                { text: 'First Name', value: 'firstName' },
                { text: 'Last', value: 'lastName' },
                { text: 'Email', value: 'email' },
                { text: 'Available Days', value: 'availableDays' }
            ]
        };
    },

    computed: {
        ...mapGetters({
            employees: 'employees',
            employee: 'employee',
            contracts: 'contracts',
            isAdmin: 'isAdmin',
            isEmployee: 'isEmployee',
            user: 'getUser'
        })
    },

    mounted() {
        try {
            if (this.isAdmin) {
                this.getEmployees();
            }
        } catch (error) {
            console.error(error);
        }

        this.loggedStatus();
        this.getContracts();
        this.getEmployee(this.user.id);
    },

    methods: {
        ...mapActions([
            'getEmployees',
            'getContracts',
            'getEmployee',
            'loggedStatus'
        ]),

        availableDays(item) {
            const { freeDays, duration, usedDays } = item;

            const days = (duration / 12) * freeDays;

            return Math.round(days) - usedDays;
        }
    }
};
</script>
