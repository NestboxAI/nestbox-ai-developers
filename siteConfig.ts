interface SiteConfig {
	siteName: string;
	siteLandingURL: string;
	siteDashboardURL: string;
	githubURL: string;
	stackOverflowTag: string;
	productionURL: string;
}

const config: SiteConfig = {
	siteName: "Nestbox AI",
	siteLandingURL: "https://nestbox.ai/",
	siteDashboardURL: "https://demo.nestbox.ai/",
	productionURL: "https://developers.nestbox.ai",
	githubURL: "https://github.com/NestboxAI/",
	stackOverflowTag: "nestboxai",
};

export default config;
