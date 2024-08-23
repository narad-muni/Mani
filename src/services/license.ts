import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { LICENSE_FILE_NAME, VALID_LICENSE } from "../constants";

export class License {
    public static status = false;
    public static async loadLicense() {
        try {
            const license = await Filesystem.readFile({
                path: LICENSE_FILE_NAME,
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

            License.status = license.data == VALID_LICENSE;

            return license.data == VALID_LICENSE;
        } catch (e) {
            License.status = false;

            return false;
        }
    }

    public static saveLicense(key: string) {
        Filesystem.writeFile({
            path: LICENSE_FILE_NAME,
            data: key,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
        });

        License.status = key == VALID_LICENSE;

        if (!License.status) {
            alert("License key is not valid");
        }

        return License.status;
    }
}