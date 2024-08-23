import { Directory, Filesystem } from "@capacitor/filesystem";

export const DB_FILE_NAME = "maniSQLite.db";

export const LICENSE_FILE_NAME = "license.lic";
export const LICENSE_FILE_PATH = (await Filesystem.getUri({
    path: LICENSE_FILE_NAME,
    directory: Directory.Data,
})).uri;

export const VALID_LICENSE = "helloworld";