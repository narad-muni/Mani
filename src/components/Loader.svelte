<script>
	import { Spinner } from "flowbite-svelte";
    import { loader } from "../services/loading";
</script>

{#if $loader}
    <div class="w-full flex justify-center items-center h-screen bg-gray-600 opacity-80 absolute z-50">
        <Spinner/>
    </div>
{/if}