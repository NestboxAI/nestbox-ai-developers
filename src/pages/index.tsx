import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import siteConfig from "@site/siteConfig";
import CopyCommandBox from '../components/CopyCommandBox/CopyCommandBox';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading className={clsx("hero__title", styles.heading)} as="h1" >
          Welcome, {siteConfig.siteName} Developers!
        </Heading>
        <br />
        <p className={clsx("hero__subtitle", styles.subHeading)}>The place for developers to explore and master {siteConfig.siteName} tools, helping you understand and build AI-Native solutions with ease.</p>
        <br />
        <div className={styles.ctaContainer}>
          <div>
            <Link
              className="button button--secondary button--lg"
              to="/docs/welcome-to-the-developer-portal">
              Get Started
            </Link>
          </div>
          <CopyCommandBox command="npm install -g @nestbox-ai/cli" />
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
