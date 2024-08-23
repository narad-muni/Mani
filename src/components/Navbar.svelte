<script lang="ts">
	import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
	import { Button, Navbar, NavBrand, NavLi, NavUl, Modal, Label, Input } from "flowbite-svelte";
    import { FilePicker } from '@capawesome/capacitor-file-picker';
	import { location } from "svelte-spa-router";
	import { Db } from "../services/db";
    import { jsPDF } from "jspdf";
    import html2canvas from 'html2canvas';
	import { loader } from "../services/loading";

    let modal = false;
	$: loc = "#" + $location;
    const fields = [
        "Date",
        "Amount",
        "Name",
        "Nominee",
        "Type",
        "Period",
        "Interest",
        "Issue Date",
        "Demat",
        "Maturity Date",
        "Received",
    ];

    let entryObject = {
        "Date": null,
        "Amount": null,
        "Name": null,
        "Nominee": null,
        "Type": null,
        "Period": null,
        "Interest": null,
        "Issue Date": null,
        "Demat": null,
        "Maturity Date": null,
        "Received": null,
    };

    async function addEntry() {
        try{
            const result = await Db.run(`
                insert into entries(
                    date,
                    amt,
                    name,
                    nominee,
                    type,
                    period,
                    interest,
                    issue_date,
                    demat,
                    maturity_date,
                    maturity_amt
                ) values(
                    '${entryObject["Date"]}',
                    ${entryObject["Amount"]},
                    '${entryObject["Name"]}',
                    '${entryObject["Nominee"]}',
                    '${entryObject["Type"]}',
                    ${entryObject["Period"]},
                    ${entryObject["Interest"]},
                    '${entryObject["Issue Date"]}',
                    '${entryObject["Demat"]}',
                    '${entryObject["Maturity Date"]}',
                    ${entryObject["Amount"]}
                );`
            );

            window.location.reload();
        }catch(e) {
            alert(e);
        }

    }

    async function exportDb() {
        loader.set(true);
        try{
            await Filesystem.copy({
                from: (await Db.con.getUrl()).url || "",
                to: "maniSQLite.db",
                toDirectory: Directory.Documents,
            });

            alert("Data file saved to your documents folder");
        }finally{
            loader.set(false);
        }
    }

    async function importDb() {
        loader.set(true);
        try{
            const result = await FilePicker.pickFiles({
                readData: true,
            });

            const file = result["files"][0];

            await Filesystem.writeFile({
                path: (await Db.con.getUrl()).url || "",
                data: file.data as string,
            });

            alert("Data imported successfully");

            window.location.reload();
            
        }catch(e) {
            alert("Unable to import file."+e);
        }finally{
            loader.set(false);
        }
    }

    async function printTable() {
        /// Print table
        loader.set(true);
        try{
            const doc = new jsPDF('p', 'pt', 'a4');
            
            const canvas = await html2canvas(document.getElementById("table") as HTMLElement, { scale: 1 });
            let imgData = canvas.toDataURL("image/png", 0.5);

            const imgWidth = 595.28; // A4 width in points (210mm)
            const pageHeight = 841.89; // A4 height in points (297mm)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const pdfOutput = doc.output('datauristring').split(',')[1];

            await Filesystem.writeFile({
                path: "table.pdf",
                data: pdfOutput,
                directory: Directory.Documents,
            });

            alert("Data exported");

        }catch(e) {
            alert(e);
        }finally{
            loader.set(false);
        }
    }
</script>

<Navbar>
	<NavBrand href="/#/">
		<img src="/logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite
        </span>
	</NavBrand>
	<NavUl
		ulClass="flex flex-row gap-x-1"
		activeUrl={loc}
	>
        <Button on:click={printTable} color="blue" class="me-2 py-0">
            Print
        </Button>
        <Button on:click={exportDb} color="blue" class="me-2 py-0">
            Export
        </Button>
        <Button on:click={importDb} color="blue" class="me-2 py-0">
            Import
        </Button>
        <Button on:click={() => modal = true} color="blue" class="me-2 py-0">
            Add
        </Button>
		<NavLi href="#/upcoming">Upcoming</NavLi>
		<NavLi href="#/matured">Matured</NavLi>
		<NavLi href="#/completed">Completed</NavLi>
		<NavLi href="#/dividend">Dividend</NavLi>
	</NavUl>
</Navbar>

<Modal headerClass="flex justify-between items-center p-2 rounded-t-lg" footerClass="flex items-center p-2 space-x-3 rounded-b-lg" size="xl" title="Add Entry" bind:open={modal} autoclose>

    <div class="grid gap-2 grid-cols-4">
        {#each fields as field}
            <div class="mb-6 col-span-1">
                <Label for="default-input" class="block mb-2">{field}</Label>
                <Input bind:value={entryObject[field]} id={field}/>
            </div>
        {/each}
    </div>

    <svelte:fragment slot="footer">
      <Button on:click={addEntry}>Add</Button>
      <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>