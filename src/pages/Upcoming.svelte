<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { Db } from "../services/db";
	import { loader } from "../services/loading";

    let data: any;

    async function mount() {
        data = await getData();
    }

    async function deleteEntry(id: string) {
        const confirmation = confirm("Are you sure you want to delete this entry?");

        if(!confirmation) { return; }

        try{
            await Db.run(`delete from entries where id = '${id}'`);
            data = await getData();
        }catch(e) {
            alert(e);
        }
    }

    async function getData() {
        loader.set(true);
        try{            
            return await Db.query(`select * from entries order by maturity_date desc limit 10`);
        }catch(e) {
            alert(e);
            return e;
        }finally{
            loader.set(false);
        }
    }

</script>

{#await mount() then _}
<div id="table">
    <Table shadow>
        <TableHead>
            <TableHeadCell>Date / Amt</TableHeadCell>
            <TableHeadCell>Name / Nominee</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Period</TableHeadCell>
            <TableHeadCell>Interest</TableHeadCell>
            <TableHeadCell>Issue date / Demat</TableHeadCell>
            <TableHeadCell>Maturity Date / Amt</TableHeadCell>
            <TableHeadCell>
                <span class="sr-only">Action</span>
            </TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
                {#each data.values as v}
                    <TableBodyRow>
                        <TableBodyCell>{v.date || "-"}<br/>{v.amt || "-"}</TableBodyCell>
                        <TableBodyCell>{v.name || "-"}<br/>{v.nominee || "-"}</TableBodyCell>
                        <TableBodyCell>{v.type || "-"}</TableBodyCell>
                        <TableBodyCell>{v.period || "-"}</TableBodyCell>
                        <TableBodyCell>{v.interest || "-"}</TableBodyCell>
                        <TableBodyCell>{v.issue_date || "-"}<br/>{v.demat || "-"}</TableBodyCell>
                        <TableBodyCell>{v.maturity_date || "-"}<br/>{v.maturity_amt || "-"}</TableBodyCell>
                        <TableBodyCell class="flex gap-x-2 justify-start">
                            <button on:click={()=>alert("edit")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi text-blue-500 bi-pencil" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                </svg>
                            </button>
                            <button on:click={()=>deleteEntry(v.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi text-red-500 bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
        </TableBody>
    </Table>
</div>
{/await}