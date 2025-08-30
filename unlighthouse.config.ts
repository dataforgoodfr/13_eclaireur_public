import { defineUnlighthouseConfig } from "unlighthouse/config";

export default defineUnlighthouseConfig({
	site: "https://13_eclaireur_public-pr-404.cleverapps.io/",
	urls: [
		"/",
		"/advanced-search?page=2",
		"/map",
		"/community/213105554",
		"/community/213105554/comparison/216901231?year=2023",
	],
	scanner: {
		device: "desktop", // Simulate desktop view
		throttle: false, // Disable throttling to ensure full-page capture
		samples: 3, // Run lighthouse for each URL 3 times for consistent results
	},
	cache: false, // Disable caching for fresh scans in dev mode
	debug: true, // Enable debug mode for development
	lighthouseOptions: {
		output: "html", // Output format for the report
		onlyCategories: ["performance", "accessibility", "best-practices", "seo"], // Optional: specify categories
		formFactor: "mobile",
		screenEmulation: {
			mobile: true,
			width: 393,
			height: 852,
			deviceScaleFactor: 3,
			disabled: false,
		},
	},
});
