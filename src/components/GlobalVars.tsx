import React from "react";
import config from "../../siteConfig";

export const SiteName: React.FC = () => <>{config.siteName}</>;

export const DashboardURL: React.FC = () => {
	return (
		<a href={config.siteDashboardURL}>
			<span style={{textDecoration: "underline"}}>{config.siteName} Dashboard</span>
		</a>
	);
};

export const CliCommand: React.FC = () => <>{config.cliCommand}</>;
