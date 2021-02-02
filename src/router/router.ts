import {createWebHistory, createRouter} from "vue-router";
import Home from "@/components/Home.vue";
import TestComponent from "@/components/test.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/test",
        name: "Test",
        component: TestComponent
    }]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
