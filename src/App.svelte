<script lang="ts">
	import Router from "svelte-spa-router";
	import "./app.css";
	import Home from "./pages/Home.svelte";
	import Navbar from "./components/Navbar.svelte";
	import Upcoming from "./pages/Upcoming.svelte";
	import Matured from "./pages/Matured.svelte";
	import Completed from "./pages/Completed.svelte";
	import Dividend from "./pages/Dividend.svelte";
	import { Filesystem } from "@capacitor/filesystem";
	import { License } from "./services/license";
	import { Button, Input, Label } from "flowbite-svelte";
	import { Db } from "./services/db";
	import Loader from "./components/Loader.svelte";

    let key = "";

    $: licenseStatus = License.status;

	async function mount() {
		while (
			(await Filesystem.requestPermissions()).publicStorage !== "granted"
		) {
			alert("Please allow access to your storage");
		}

        License.status = await License.loadLicense();
        await Db.initTables();
	}

	const routes = {
		"/": Home,
		"/upcoming": Upcoming,
		"/matured": Matured,
		"/completed": Completed,
		"/dividend": Dividend,
	};

	let orientation = screen.orientation.type;

    screen.orientation.addEventListener("change", (event) => {
        orientation = screen.orientation.type;
        window.location.reload();
    });
</script>

<Loader />
{#await mount() then _}
    {#if licenseStatus == true}
		{#if orientation === "landscape-primary" || orientation === "landscape-secondary"}
			<body class="px-3">
				<Navbar />
				<Router {routes} />
			</body>
		{:else}
			<body
				class="bg-gray-600 w-full h-screen text-white flex flex-col justify-center items-center"
			>
				<p class="text-3xl">Please rotate your device</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="h-40 w-40"
					viewBox="0 0 16 16"
				>
					<path
						d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"
					/>
					<path
						fill-rule="evenodd"
						d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="h-24 w-24"
					viewBox="0 0 16 16"
				>
					<path
						d="M1 4.5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm-1 6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2z"
					/>
					<path d="M14 7.5a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
				</svg>
			</body>
		{/if}
    {:else}
        <div class="mt-10 m-6">
            <Label for="large-input" class="block mb-2"
                >Please enter license key</Label
            >
            <Input bind:value={key} class="mb-3" id="large-input" size="lg" placeholder="xxxxxxxxxxxxx" />
            <Button class="w-full" color="primary" on:click={() => License.status = License.saveLicense(key)}
                >Submit</Button
            >
        </div>
    {/if}
{/await}