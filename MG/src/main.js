import App from './App.svelte';
import { mount } from "svelte";

const app = mount(App, {
	target: document.body,
	props: {
		name: 'project'
	}
});

export default app;