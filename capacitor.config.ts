import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.mani.saumil",
	appName: "flowbite",
	webDir: "dist",
	server: {
		url: "http://192.168.1.25:5173/",
		cleartext: true,
	},
	plugins: {
		CapacitorSQLite: {
			androidIsEncryption: false,
			androidBiometric: {
				biometricAuth: false,
				biometricTitle: "Biometric login for capacitor sqlite",
				biometricSubTitle: "Log in using your biometric",
			},
		},
	},
};

export default config;
