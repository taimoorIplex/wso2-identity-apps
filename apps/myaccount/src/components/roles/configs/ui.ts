/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {  AppConstants } from "../../../constants";

export const getRolesWizardStepIcons= () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        assignUser: import(`../../../themes/${ theme }/assets/images/icons/user-icon.svg`),
        general: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`),
        permissions: import(`../../../themes/${ theme }/assets/images/icons/key-icon.svg`),
        summary: import(`../../../themes/${ theme }/assets/images/icons/report-icon.svg`)
    };
};


export const getEmptyPlaceholderIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        alert: import(`../../../themes/${ theme }/assets/images/icons/alert-icon.svg`),
        brokenPage: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/broken-page-illustration.svg`),
        emptyList: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-list-illustration.svg`),
        emptySearch: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-search-illustration.svg`),
        fileUpload: import(`../../../themes/${ theme }/assets/images/icons/upload.svg`),
        genericError: import(`../../../themes/${ theme }/assets/images/icons/close-icon.svg`),
        loginError: import(`../../../themes/${ theme }/assets/images/icons/forbidden-icon.svg`),
        newList: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-list-illustration.svg`),
        pageNotFound: import(`../../../themes/${ theme }/assets/images/icons/blocked-magnifier-icon.svg`),
        search: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-search-illustration.svg`)
    };
};
