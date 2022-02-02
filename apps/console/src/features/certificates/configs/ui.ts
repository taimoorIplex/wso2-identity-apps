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

import { AppConstants } from "../../core/constants";

export const getCertificateIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        avatar: import(`../../../themes/${ theme }/assets/images/icons/certificate-avatar.svg`),
        badge: import(`../../../themes/${ theme }/assets/images/illustrations/badge.svg`),
        file: import(`../../../themes/${ theme }/assets/images/illustrations/certificate.svg`),
        ribbon: import(`../../../themes/${ theme }/assets/images/illustrations/ribbon.svg`),
        uploadPlaceholder: import(`../../../themes/${ theme }/assets/images/icons/upload.svg`)
    };
};

export const getImportCertificateWizardStepIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        general: import(`../../../themes/${ theme }/assets/images/icons/document-icon.svg`)
    };
};
