<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app clipped>
            <v-list-item :to="{ name: 'home' }">
                <v-list-item-action>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item v-if="isAdmin" :to="{ name: 'employees' }">
                <v-list-item-action>
                    <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Employees</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{ name: 'contracts' }">
                <v-list-item-action>
                    <v-icon>mdi-file-document-outline</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Contracts</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{ name: 'vacations' }">
                <v-list-item-action>
                    <v-icon>mdi-account-clock</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Vacation Requests</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-navigation-drawer>

        <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
        >
            <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">Dashboard</span>
            </v-toolbar-title>

            <v-spacer />
            <v-subheader
                >Hi, {{ user.firstName }} {{ user.lastName }} !</v-subheader
            >

            <v-btn text large @click="logout">
                <span>Logout</span>
            </v-btn>
        </v-app-bar>

        <v-content>
            <slot />
        </v-content>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    props: {
        source: String
    },

    data() {
        return {
            dialog: false,
            drawer: null
        };
    },

    computed: {
        ...mapGetters({
            user: 'getUser',
            isAdmin: 'isAdmin',
            isEmployee: 'isEmployee'
        })
    },

    methods: {
        ...mapActions(['clearStorage']),

        logout() {
            this.clearStorage();

            this.$router.push({ name: 'login' });
        }
    }
};
</script>
