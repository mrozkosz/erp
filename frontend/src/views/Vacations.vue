<template>
    <v-container class="grey lighten-5">
        <v-overlay :absolute="boxOverlay.absolute" :value="boxOverlay.overlay">
            <sweetalert-icon icon="success" />
            <div class="white--text mb-2" />
        </v-overlay>

        <CreateOrUpdate
            :isVisible="isDialogVisible"
            :vacationDay="vacationDay"
            @onCloseDialog="onCloseDialog"
            @pushNewItem="pushNewItem"
            @updateItem="updateItem"
        />

        <showEmployee
            :isVisible="isUserDialogVisible"
            :userId="userId"
            @onCloseUserDialog="onCloseUserDialog"
        />

        <v-data-table
            :headers="headers"
            :items="vacationDays.data"
            :page.sync="currentPage"
            hide-default-footer
            sort-by="id"
            class="elevation-1"
            @click:row="onShowUserDialog"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Vacations</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical />
                    <v-spacer />
                    <v-btn color="primary" dark class="mb-2" @click="onOpenDialog()">New Vacations</v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item.approved="{ item }">
                <v-simple-checkbox v-model="item.isApproved" disabled></v-simple-checkbox>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon v-if="isEmployee" small>mdi-eye</v-icon>
                <v-icon
                    v-if="isAdmin || !item.isApproved"
                    small
                    class="mr-2"
                    @click.stop="onOpenDialog(item)"
                >mdi-pencil</v-icon>

                <v-icon v-if="isAdmin" small @click.stop="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <v-pagination
            v-model="currentPage"
            :length="vacationDays.totalPages"
            @input="onPageChange"
        />
    </v-container>
</template>

<script>
import showEmployee from '@/components/employees/showEmployee';
import CreateOrUpdate from '@/components/vacations/CreateOrUpdate';
import SweetalertIcon from 'vue-sweetalert-icons';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'Vacations',
    components: {
        CreateOrUpdate,
        SweetalertIcon,
        showEmployee
    },
    data() {
        return {
            currentPage: 1,
            isDialogVisible: false,
            isUserDialogVisible: false,
            userId: null,
            vacationDay: {
                userId: '',
                id: '',
                startDay: '',
                stopDay: '',
                days: '',
                isApproved: ''
            },
            params: {
                page: 1
            },
            boxOverlay: {
                absolute: false,
                overlay: false,
                zIndex: 5
            },
            headers: [
                {
                    text: 'id',
                    align: 'start',
                    sortable: true,
                    value: 'id'
                },
                { text: 'Start at...', value: 'startDay', sortable: true },
                { text: 'Stop at...', value: 'stopDay', sortable: true },
                { text: 'Used days', value: 'days', sortable: true },
                { text: 'Approved', value: 'approved' },
                { text: 'Actions', value: 'actions' }
            ]
        };
    },

    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin',
            isEmployee: 'isEmployee',
            user: 'getUser',
            vacationDays: 'vacationDays'
        })
    },

    mounted() {
        this.loggedStatus();
        this.getVacationDays();
    },

    methods: {
        ...mapActions([
            'getVacationDays',
            'loggedStatus',
            'deleteVacationDay',
            'createVacationDay',
            'updateVacationDay'
        ]),

        updateItem(item) {
            this.updateVacationDay(item);

            this.showAlert();
        },

        onOpenDialog(item = {}) {
            this.isDialogVisible = true;
            this.vacationDay = item;
        },

        onCloseDialog() {
            this.isDialogVisible = false;
        },

        onShowUserDialog(item) {
            this.userId = item.userId;
            this.isUserDialogVisible = true;
        },

        onCloseUserDialog() {
            this.userId = null;
            this.isUserDialogVisible = false;
        },

        onPageChange(page) {
            this.params.page = page;

            this.getVacationDays({ ...this.params });
        },

        deleteItem(item) {
            this.deleteVacationDay(item.id);

            this.showAlert();
        },

        pushNewItem(item) {
            this.createVacationDay(item);

            this.showAlert();
        },

        showAlert() {
            this.boxOverlay.overlay = true;
            setTimeout(() => {
                this.boxOverlay.overlay = false;
            }, 2000);
        }
    }
};
</script>
