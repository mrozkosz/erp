<template>
    <v-row justify="center">
        <v-dialog v-model="isVisible" persistent max-width="300px">
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-img
                    src="@/assets/user.jpg"
                    lazy-src="@/assets/user.jpg"
                    alt="user image"
                    :aspect-ratio="4 / 3"
                />
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12">
                                <h4 class="text-md-center">
                                    {{ employee.firstName }}
                                    {{ employee.lastName }}
                                </h4>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <h4 class="text-md-center">{{employee.email}}</h4>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="onCloseDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        isVisible: Boolean,
        userId: Number
    },

    data() {
        return {};
    },

    computed: {
        ...mapGetters(['employee'])
    },

    watch: {
        isVisible() {
            if (this.isVisible) {
                this.fetchData();
            }
        }
    },

    methods: {
        ...mapActions(['getEmployee']),

        fetchData() {
            this.getEmployee(this.userId);
        },

        onCloseDialog() {
            this.$emit('onCloseUserDialog');
        }
    }
};
</script>
