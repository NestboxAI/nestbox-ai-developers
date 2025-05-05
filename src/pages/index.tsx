import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import siteConfig from "@site/siteConfig";

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading style={{maxWidth: "30ch", margin: "auto"}} as="h1" className="hero__title">
          Welcome to the {siteConfig.siteName} Developer Portal!
        </Heading>
        <br />
        <p style={{maxWidth: "60ch", margin: "auto"}} className="hero__subtitle">The place for developers to explore and master {siteConfig.siteName} tools, helping you understand and integrate AI solutions with ease.</p>
        <br />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/welcome-to-the-developer-portal">
            Get Started
          </Link>
        </div>
        
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="The place for developers to explore and master {siteConfig.siteName} tools, helping you understand and integrate AI solutions with ease.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
