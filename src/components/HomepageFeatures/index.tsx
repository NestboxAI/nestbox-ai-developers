import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Advanced Document Intelligence',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Efficiently parse, catalog, tag, store, and manage large-scale document sets.
        Quickly query and retrieve information from complex documents, enhancing agent accuracy and reducing manual data handling
      </>
    ),
  },
  {
    title: 'Seamless Agent Integration',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Easily create, customize, and deploy AI agents capable of autonomously executing operations via seamless third-party integrations. 
        Automate workflows across existing systems, boosting productivity and reducing human oversight
      </>
    ),
  },
  {
    title: 'Developer-First Experience',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Designed with developers in mind: intuitive SDKs, comprehensive APIs, robust CLI tools, and thorough documentation.
        Accelerate development timelines and reduce complexity, ensuring rapid adoption and ease of use for technical teams.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
