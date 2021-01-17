<template>
    <v-container class="grey lighten-5">
        <v-overlay :absolute="boxOverlay.absolute" :value="boxOverlay.overlay">
            <sweetalert-icon icon="success" />
            <div class="white--text mb-2"></div>
        </v-overlay>

        <CreateOrUpdate
            :isVisible="isDialogVisible"
            :employee="employee"
            @onCloseDialog="isDialogVisible = $event"
            @pushNewEmployee="pushNewEmployee"
        />

        <v-data-table
            :headers="headers"
            :items="employees.data"
            :page.sync="currentPage"
            hide-default-footer
            sort-by="id"
            class="elevation-1"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Employees</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical />
                    <v-spacer />
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="onOpenDialog()"
                        >New Employee</v-btn
                    >
                </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="onOpenDialog(item)"
                    >mdi-pencil</v-icon
                >
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>

        <v-pagination
            v-model="currentPage"
            :length="employees.totalPages"
            @input="onPageChange"
        />
    </v-container>
</template>

<script>
import CreateOrUpdate from '@/components/employees/CreateOrUpdate';
import SweetalertIcon from 'vue-sweetalert-icons';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Employees',
    components: {
        CreateOrUpdate,
        SweetalertIcon
    },

    data() {
        return {
            currentPage: 1,
            isDialogVisible: false,
            employee: {
                id: '',
                email: '',
                firstName: '',
                lastName: ''
            },
            boxOverlay: {
                absolute: false,
                overlay: false,
                zIndex: 5
            },
            params: {
                page: 1
            },
            headers: [
                {
                    text: 'id',
                    align: 'start',
                    sortable: true,
                    value: 'id'
                },
                { text: 'Email', value: 'email', sortable: true },
                { text: 'First Name', value: 'firstName', sortable: true },
                { text: 'Last Name', value: 'lastName', sortable: true },
                { text: 'Actions', value: 'actions', sortable: false }
            ]
        };
    },

    computed: {
        ...mapGetters(['employees'])
    },

    mounted() {
        this.loggedStatus();
        this.getEmployees();
    },

    methods: {
        ...mapActions([
            'getEmployees',
            'loggedStatus',
            'deleteEmployee',
            'createEmployee'
        ]),

        onPageChange(page) {
            this.params.page = page;

            this.getEmployees({ ...this.params });
        },

        onOpenDialog(item = {}) {
            this.isDialogVisible = true;

            this.employee = item;
        },

        async deleteItem(item) {
            this.deleteEmployee(item.id);

            this.showAlert();
        },

        pushNewEmployee(item) {
            this.createEmployee(item);

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
