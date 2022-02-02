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

import { AlertLevels, ExternalClaim, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    TableDataInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { AttributeSelectionWizardOtherDialect }
    from "../../applications/components/settings/attribute-management/attirbute-selection-wizard-other-dialect";
import { FeatureConfigInterface, getEmptyPlaceholderIllustrations } from "../../core";
import { updateOIDCScopeDetails } from "../api";
import { OIDCScopesManagementConstants } from "../constants";
import { OIDCScopesListInterface } from "../models";

/**
 * Proptypes for the OIDC scope edit component.
 */
interface EditScopePropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Editing scope.
     */
    scope: OIDCScopesListInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the scope details.
     */
    onUpdate: (name: string) => void;
    /**
     * Attributes that have already been selected.
     */
    selectedAttributes: ExternalClaim[];
    /**
     * Attributes that haven't been selected yet.
     */
    unselectedAttributes: ExternalClaim[];
    /**
     * Specifies if a network request is still loading.
     */
    isRequestLoading: boolean;
    /**
     * Triggers the add attribute modal.
     */
    triggerAddAttributeModal: boolean;
}

/**
 * OIDC scope edit component.
 *
 * @param {EditScopePropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const EditOIDCScope: FunctionComponent<EditScopePropsInterface> = (
    props: EditScopePropsInterface
): ReactElement => {
    const {
        scope,
        onUpdate,
        selectedAttributes,
        unselectedAttributes,
        isRequestLoading,
        triggerAddAttributeModal,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);

    const init = useRef(true);

    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            handleOpenSelectionModal();
        }
    }, [triggerAddAttributeModal]);

    const updateOIDCScope = (attributes: string[]): void => {
        const data: OIDCScopesListInterface = {
            claims: attributes,
            description: scope.description,
            displayName: scope.displayName
        };

        updateOIDCScopeDetails(scope.name, data)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope.success" + ".description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope.success" + ".message"
                        )
                    })
                );
                onUpdate(scope.name);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.oidcScopes.notifications.updateOIDCScope.error" + ".message"
                            )
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope" +
                                ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.oidcScopes.notifications.updateOIDCScope" + ".genericError.message"
                        )
                    })
                );
            });
    };

    const showAttributeSelectionModal = () => {
        return (
            <AttributeSelectionWizardOtherDialect
                availableExternalClaims={ unselectedAttributes }
                selectedExternalClaims={ selectedAttributes }
                showAddModal={ showSelectionModal }
                data-testid={ `${testId}-add-attributes` }
                setShowAddModal={ setShowSelectionModal }
                setAvailableExternalClaims={ ()=> null }
                setInitialSelectedExternalClaims={ (response: ExternalClaim[]) => {
                    const claimURIs: string[] = response?.map((claim: ExternalClaim) => claim.claimURI);
                    updateOIDCScope(claimURIs);
                } }
                setSelectedExternalClaims={ () => null }
                isScopeSection={ true }
                scopeName={ scope.displayName }
            />
        );
    };

    const handleOpenSelectionModal = () => {
        setShowSelectionModal(true);
    };

    const handleRemoveAttribute = (claim: string): void => {
        const assignedClaims = scope?.claims;
        const newClaimList = assignedClaims.filter((claimName) => claimName !== claim);

        updateOIDCScope(newClaimList);
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (claim: ExternalClaim): ReactNode => (
                    <Header image as="h6" className="header-with-icon" data-testid={ `${testId}-item-heading` }>
                        <Header.Content>
                            { claim.claimURI }
                            <Header.Subheader>
                                <code>{ claim.mappedLocalClaimURI }</code>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("console:manage.features.oidcScopes.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.oidcScopes.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                hidden: (item: TableDataInterface<ExternalClaim>) => {
                    return item.claimURI === "sub" && scope.name === OIDCScopesManagementConstants.OPEN_ID_SCOPE;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, claim: ExternalClaim): void => {
                    handleRemoveAttribute(claim.claimURI);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    const showPlaceholders = (): ReactElement => {
        return selectedAttributes?.length === 0 ? (
            <EmptyPlaceholder
                data-testid="scope-mgt-empty-claims-list"
                title={ t("console:manage.features.oidcScopes.editScope.claimList." + "emptyPlaceholder.title") }
                subtitle={ [
                    t("console:manage.features.oidcScopes.editScope.claimList." + "emptyPlaceholder.subtitles.0"),
                    t("console:manage.features.oidcScopes.editScope.claimList." + "emptyPlaceholder.subtitles.1")
                ] }
                action={
                    <PrimaryButton
                        data-testid="scope-mgt-empty-claims-list-add-claim-button"
                        onClick={ handleOpenSelectionModal }
                        icon="plus"
                    >
                        <Icon name="add" />
                        { t("console:manage.features.oidcScopes.editScope.claimList." + "emptyPlaceholder.action") }
                    </PrimaryButton>
                }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
            />
        ) : null;
    };

    return (
        <>
            <DataTable<ExternalClaim>
                className="oidc-scopes-table"
                isLoading={ isRequestLoading }
                loadingStateOptions={ {
                    count: 10,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ selectedAttributes }
                onRowClick={ () => null }
                placeholders={ showPlaceholders() }
                transparent={ !isRequestLoading && showPlaceholders() !== null }
                showHeader={ false }
                data-testid={ testId }
            />
            { showAttributeSelectionModal() }
        </>
    );
};

/**
 * Default props for the `EditOIDCScope` component.
 */
EditOIDCScope.defaultProps = {
    isRequestLoading: true
};
