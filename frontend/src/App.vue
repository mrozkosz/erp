<template>
    <v-app>
        <component :is="layout">
            <router-view></router-view>
            <notifications
                group="errors"
                position="bottom right"
                :speed="500"
                :duration="5000"
                :width="500"
            />
        </component>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    data() {
        return {
            defaultLayout: 'default'
        };
    },

    computed: {
        layout() {
            return (this.$route.meta.layout || this.defaultLayout) + '-layout';
        }
    }
};
</script>
