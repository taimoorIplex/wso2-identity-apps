/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { Approvals } from "../components";
import { InnerPageLayout } from "../layouts";
import { AlertInterface } from "../models";
import { addAlert } from "../store/actions";

/**
 * Approvals page.
 *
 * @return {JSX.Element}
 */
export const ApprovalsPage = (): JSX.Element => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    /**
     * Dispatches the alert object to the redux store.
     * @param {AlertInterface} alert - Alert object.
     */
    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    return (
        <InnerPageLayout
            pageTitle={ t("Approvals") }
            pageDescription={ t("Review operational tasks that requires your approval") }
        >
            <Divider hidden/>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Approvals onAlertFired={ handleAlerts } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </InnerPageLayout>
    );
};
