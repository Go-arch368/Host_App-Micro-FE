import scanner from 'sonarqube-scanner';

scanner(
  {
    serverUrl: process.env.SONAR_HOST_URL || 'http://sonar.multiplan.com',
    token: process.env.SONAR_AUTH_TOKEN,
    options: {
      'sonar.projectKey': 'proLinkHost',
      'sonar.projectName': 'ProLink Host GUI',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.test.inclusions': 'src/**/*.test.ts,src/**/*.test.tsx',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.typescript.tsconfigPath': 'tsconfig.json',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.coverage.exclusions': 'src/**/*.test.*,**/__mocks__/**,src/context/**,src/services/**,src/**/*',
    },
  },
  (error) => {
    if (error) console.error(error);
    process.exit(error ? 1 : 0);
  }
);