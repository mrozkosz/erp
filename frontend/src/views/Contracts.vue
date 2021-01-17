<template>
    <v-container class="grey lighten-5">
        <v-overlay :absolute="boxOverlay.absolute" :value="boxOverlay.overlay">
            <sweetalert-icon icon="success" />
            <div class="white--text mb-2"></div>
        </v-overlay>
        <CreateOrUpdate
            :isVisible="isDialogVisible"
            :contract="contract"
            @onCloseDialog="isDialogVisible = $event"
            @pushNewContract="pushNewContract"
        />
        <showEmployee
            :isVisible="isUserDialogVisible"
            :userId="userId"
            @onCloseUserDialog="onCloseUserDialog"
        />
        <v-card>
            <v-data-table
                :items="contracts.data"
                :headers="headers"
                :page.sync="currentPage"
                sort-by="id"
                class="elevation-2"
                hide-default-footer
                @click:row="onShowUserDialog"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title>Contracts</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical />
                        <v-spacer />
                        <v-btn
                            v-if="isAdmin"
                            color="primary"
                            dark
                            class="mb-2"
                            @click="onOpenDialog()"
                        >New Item</v-btn>
                    </v-toolbar>
                </template>
                <template v-slot:item.calculateFreeDays="{ item }">{{calculateFreeDays(item)}}</template>
                <template v-slot:item.actions="{ item }">
                    <v-icon v-if="isEmployee" small>mdi-eye</v-icon>
                    <v-icon
                        v-if="isAdmin"
                        small
                        class="mr-2"
                        @click.stop="onOpenDialog(item)"
                    >mdi-pencil</v-icon>
                    <v-icon v-if="isAdmin" small @click.stop="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
        <v-pagination v-model="currentPage" :length="contracts.totalPages" @input="onPageChange" />
    </v-container>
</template>
<script>
import showEmployee from '@/components/employees/showEmployee';
import CreateOrUpdate from '@/components/contracts/CreateOrUpdate';
import SweetalertIcon from 'vue-sweetalert-icons';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'Contract',

    components: {
        CreateOrUpdate,
        SweetalertIcon,
        showEmployee
    },

    data() {
        return {
            currentPage: 1,
            contract: {
                userId: '',
                startDay: '',
                duration: '',
                freeDays: ''
            },
            isDialogVisible: false,
            isUserDialogVisible: false,
            userId: null,
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
                { text: 'Start at', value: 'startDay', sortable: true },
                { text: 'Stop at', value: 'stopDay', sortable: true },

                {
                    text: 'Total free days',
                    value: 'calculateFreeDays',
                    sortable: false
                },
                {
                    text: 'Used days',
                    value: 'usedDays',
                    sortable: true
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                }
            ]
        };
    },

    computed: {
        ...mapGetters(['isAdmin', 'isEmployee', 'contracts'])
    },

    mounted() {
        this.loggedStatus();
        this.getContracts();
    },

    methods: {
        ...mapActions([
            'getContracts',
            'loggedStatus',
            'deleteContract',
            'createContract'
        ]),

        onCloseUserDialog() {
            this.userId = null;
            this.isUserDialogVisible = false;
        },

        onShowUserDialog(item) {
            this.userId = item.userId;
            this.isUserDialogVisible = true;
        },

        onPageChange(page) {
            this.params.page = page;

            this.getContracts({ ...this.params });
        },

        pushNewContract(item) {
            this.createContract(item);

            this.showAlert();
        },

        onOpenDialog(item = {}) {
            this.isDialogVisible = true;
            this.contract = item;
        },

        calculateFreeDays(item) {
            const days = (item.duration / 12) * item.freeDays;

            return Math.round(days);
        },

        deleteItem(item) {
            this.deleteContract(item.id);

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
