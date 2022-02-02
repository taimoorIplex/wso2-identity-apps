# WSO2 Identity Server Apps

End-user apps in WSO2 Identity Server

|  Branch | Build Status | Travis CI Status |
| :------------ |:------------- |:-------------
| master      | [![Build Status](https://wso2.org/jenkins/view/Dashboard/job/platform-builds/job/identity-apps/badge/icon)](https://wso2.org/jenkins/view/Dashboard/job/platform-builds/job/identity-apps/) | [![Build Status](https://travis-ci.org/wso2/identity-apps.svg?branch=master)](https://travis-ci.org/wso2/identity-apps) |

## Setup build environment

1. Install NodeJS from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Install Maven from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).

## Build & Run

#### Build

1. Download or clone the project source code from [https://github.com/wso2/identity-apps](https://github.com/wso2/identity-apps)
2. Run `mvn clean install` from the command line in the project root directory (where the root `pom.xml` is located).

If you are building [product-is](https://github.com/wso2/product-is), the built identity apps dependencies will install to your local `.m2` repository during the build above.

3. Then you just need to build [WSO2 Identity Server](https://github.com/wso2/product-is) after. _(Follow the guide there)_

#### Run

4. Execute `wso2server.sh` (For unix environment) or `wso2server.bat` (For windows environment) file from the `bin` directory to run the WSO2 Identity Server.
5. Navigate to `https://localhost:9443/myaccount` or `https://localhost:9443/console` from the browser. (Add certificate exception if required)

## Run in dev mode

1. **Do only if you skip WSO2 Identity Server build step above:** Download the built distribution of WSO2 Identity Server from [https://wso2.com/identity-and-access-management/](https://wso2.com/identity-and-access-management/).

2. Add the following code to `repository/conf/deployment.toml` in `WSO2 Identity Server` distribution pack to allow CORS.

    ```toml
    [cors]
    allowed_origins = [
       "https://localhost:9000",
       "https://localhost:9001"
    ]
    supported_methods = [
       "GET",
       "POST",
       "HEAD",
       "OPTIONS",
       "PUT",
       "PATCH",
       "HEAD",
       "DELETE",
       "PATCH"
    ]
    exposed_headers = [ "Location" ]
    ```
3. Add your hostname and port as a trusted FIDO2 origin to the `deployment.toml` file as given below.

    ```toml
     [fido.trusted]
     origins=["https://localhost:9000"]
    ```
4. Currently, `Console` & `My Account` are considered as system applications hence they are readonly by default. So in order to configure the  `Callback Urls` as specified in **step 7**, you need to add the following config to the `deployment.toml` file to override the default behaviour.

    ```toml
    [system_applications]
    read_only_apps = []
    ```
5. Execute `wso2server.sh` (For unix environment) or `wso2server.bat` (For windows environment) file from the `bin` directory to run WSO2 Identity Server.
6. Navigate to `https://localhost:9443/carbon/` from the browser, and login to the system by entering an admin password.
> **Hint!** Can find out the default password details here: [https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator](https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator)
7. In the system, navigate to `Service Providers -> List` from left side panel. And then go to `Edit` option in the application that you want to configure in dev mode (ex: `MY_ACCOUNT`). Then click on `Inbound Authentication Configuration -> OAuth/OpenID Connect Configuration -> Edit`. And then update the `Callback Url` field with below corresponding values.

    **My Account**

    ```
    regexp=(https://localhost:9443/myaccount/login|https://localhost:9443/myaccount/logout|https://localhost:9000/myaccount/login|https://localhost:9000/myaccount/logout)
    ```

    **Console**

    ```
    regexp=(https://localhost:9443/console/login|https://localhost:9443/console/logout|https://localhost:9001/console/login|https://localhost:9001/console/logout)
    ```

8. Open cloned or downloaded Identity Apps repo and Run `npm run build` from the command line in the project root directory (where the `package.json` is located) to build all the packages with dependencies. _(Note:- Not necessary if you have already done above identity apps build steps)_

   > **_Note:-_** 
   >  
   > To build a single package/app, you can use this command: `npx lerna bootstrap --scope <package-name> && npx lerna run --scope <package-name> build`.   
   >
   > E.g. `npx lerna bootstrap --scope @wso2is/myaccount && npx lerna run --scope @wso2is/myaccount build`

9. Start the apps in development mode, Execute `cd apps/<app> && npm start` command. E.g. `cd apps/myaccount && npm start`.
10. Once the app is successfully started, you can access the via the URLs `https://localhost:9000/myaccount` or `https://localhost:9001/console`.

## Running Tests

### Unit Tests

Product Unit tests have been implemented using [Jest](https://jestjs.io/) along with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
and you can run the unit test suites using the following commands.

#### Run Tests for all modules

```bash
npm run test
```

#### Run Tests for individual module

```bash
npx lerna run test --scope @wso2is/forms
```

### Integration Tests

Product integration tests have been written using [Cypress Testing Framework](https://www.cypress.io/) and you can run the test suites using the following command.

#### Headless mode

```bash
npm run test:integration
```

#### Interactive mode

```bash
npm run test:integration:interactive
```

#### Only Smoke Tests

```bash
npm run test:integration:smoke
```

For more information regarding the test module, checkout the [README](./tests/README.md) in the `tests` module.

## Configuration

The portals i.e. Console & My Account are configurable using the `deployment.toml` when they are hosted inside the Identity Server.
Read through our [configurations guidelines](./docs/CONFIGURATION.md) to learn about the configuration process.

## Deployment

#### Deploying the apps on an external server

It is possible to deploy the Console and My Account applications on an external server. To do so, the following steps has to be followed in order to build the applications.

##### Method 1 - Build using Maven

Follow the steps in listed [here](#build) in-order to build the project with maven.

Once the build is complete, execute the following commands in-order to build the Console & My Account applications for external deployment.

**Console**

```bash
npx lerna run build:external --scope @wso2is/console
```

Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/console/build`.

**My Account**

```bash
npx lerna run build:external --scope @wso2is/myaccount
```

Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/myaccount/build`.

##### Method 2 - Build using npm

You can simply use npm to build the Console and My Account applications for external deployment by just executing the following script.

```bash
# From project root
npm run build:external
```

The respective build artifacts could be found inside the build folder. (`apps/(myaccount|console)/build`)

## Reporting Issues

We encourage you to report issues, improvements and feature requests regarding the project through [GitHub Issue Tracker](https://github.com/wso2/product-is/issues).

**Important:** And please be advised that, security issues must be reported to [security@wso2.com](mailto:security@wso2.com), not as GitHub issues, in order to reach proper audience. We strongly advise following the [WSO2 Security Vulnerability Reporting Guidelines](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Reporting+Guidelines) when reporting the security issues.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
