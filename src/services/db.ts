import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { DB_FILE_NAME } from "../constants";

export class Db {
    static con: SQLiteDBConnection;

    static async getConnection() {
        if (Db.con !== undefined) {
            return Db.con;
        }
    
        const sqlite = new SQLiteConnection(CapacitorSQLite);

        if((await sqlite.checkConnectionsConsistency()).result) {
            alert("Closing");
            await sqlite.closeAllConnections();
        }

        try{
            Db.con = await sqlite.createConnection(DB_FILE_NAME, false, 'no-encryption', 3, false);
            await Db.con.open();
        }catch(e){
            alert(e);
        }

        return Db.con;
    }

    public static async execute(sql: string) {
        const con = await Db.getConnection();
        return await con.execute(sql);
    }

    public static async query(sql: string) {
        const con = await Db.getConnection();
        return await con.query(sql);
    }

    public static async run(sql: string) {
        const con = await Db.getConnection();
        return await con.run(sql);
    }
    
    public static async initTables() {
        const con = await Db.getConnection();
        
        await con.execute(`
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date date,
                amt real,
                name text,
                nominee text,
                type text,
                period real,
                interest real,
                issue_date date,
                demat text,
                maturity_date date,
                maturity_amt real);
        `);

        // for(let i = 0; i < 100; i++) {

        //     await con.run(`
        //         insert into entries(
        //             date,
        //             amt,
        //             name,
        //             nominee,
        //             type,
        //             period,
        //             interest,
        //             issue_date,
        //             demat,
        //             maturity_date,
        //             maturity_amt
        //         ) values(
        //             '2024-01-01',
        //             1.1,
        //             'abcdef',
        //             'abcdef',
        //             'abcdef',
        //             1.1,
        //             1.1,
        //             '2024-01-01',
        //             'abcdef',
        //             '2024-01-01',
        //             1.1);
        //     `);
        // }
    }
}