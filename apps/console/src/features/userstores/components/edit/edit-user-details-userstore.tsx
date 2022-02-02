/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { AlertInterface, AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { EmphasizedSegment, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { SqlEditor } from "..";
import { patchUserStore } from "../../api";
import { RequiredBinary, TypeProperty, UserstoreType } from "../../models";
import { CONSUMER_USERSTORE_ID } from "../../constants";

/**
 * Prop types of `EditUserDetails` component
 */
interface EditUserDetailsPropsInterface extends TestableComponentInterface {
    /**
     * Initiates an update
     */
    update: () => void;
    /**
     * userstore id
     */
    id: string;
    /**
     * The type meta data
     */
    type: UserstoreType;
    /**
     * The connection properties.
     */
    properties: RequiredBinary;
}

/**
 * This renders the edit userstore user details pane.
 *
 * @param {EditUserDetailsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditUserDetails: FunctionComponent<EditUserDetailsPropsInterface> = (
    props: EditUserDetailsPropsInterface
): ReactElement => {

    const {
        id,
        properties,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ showMore, setShowMore ] = useState(false);
    const [ sql, setSql ] = useState<Map<string, string>>(null);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        if (properties) {
            const tempSql = new Map<string, string>();

            properties.optional.sql.delete.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.insert.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.select.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            properties.optional.sql.update.forEach(property => {
                tempSql.set(property.name, property.value ?? property.defaultValue);
            });

            setSql(tempSql);
        }
    }, [ properties ]);

    const onSubmitHandler = (values: Map<string, FormValue>): void => {
        const requiredData = properties?.required.filter((property: TypeProperty) => {
            return values.has(property.name);
        }).map((property: TypeProperty) => {
            return {
                operation: "REPLACE",
                path: `/properties/${property.name}`,
                value: values.get(property.name).toString()
            };
        });

        const optionalNonSqlData = showMore
            ? properties?.optional.nonSql.filter((property: TypeProperty) => {
                return values.has(property.name);
            }).map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: values.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlInsertData = showMore
            ? properties?.optional.sql.insert.filter((property: TypeProperty) => {
                return (sql.has(property.name) && sql.get(property.name).toString() !== "");
            }).map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlUpdateData = showMore
            ? properties?.optional.sql.update.filter((property: TypeProperty) => {
                return (sql.has(property.name) && sql.get(property.name).toString() !== "");
            }).map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlDeleteData = showMore
            ? properties?.optional.sql.delete.filter((property: TypeProperty) => {
                return (sql.has(property.name) && sql.get(property.name).toString() !== "");
            }).map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const optionalSqlSelectData = showMore
            ? properties?.optional.sql.select.filter((property: TypeProperty) => {
                return (sql.has(property.name) && sql.get(property.name).toString() !== "");
            }).map((property: TypeProperty) => {
                return {
                    operation: "REPLACE",
                    path: `/properties/${property.name}`,
                    value: sql.get(property.name).toString()
                };
            })
            : null;

        const data = showMore
            ? [
                ...requiredData,
                ...optionalNonSqlData,
                ...optionalSqlDeleteData,
                ...optionalSqlInsertData,
                ...optionalSqlUpdateData,
                ...optionalSqlSelectData
            ]
            : requiredData;

        patchUserStore(id, data)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.userstores.notifications." +
                        "updateUserstore.success.message")
                }));

                // ATM, userstore operations run as an async task in the backend. Hence, The changes aren't 
                // applied at once. As a temp solution, a notification informing the delay is shown here.
                // See https://github.com/wso2/product-is/issues/9767 for updates on the backend improvement.
                // TODO: Remove delay notification once the backend is fixed.
                dispatch(addAlert<AlertInterface>({
                    description: t("console:manage.features.userstores.notifications.updateDelay.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:manage.features.userstores.notifications.updateDelay.message")
                }));

                // Re-fetch the userstore details
                update();
            })
            .catch(error => {
                dispatch(addAlert<AlertInterface>({
                    description: error?.description
                        || t("console:manage.features.userstores.notifications." +
                            "updateUserstore.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("console:manage.features.userstores.notifications." +
                        "updateUserstore.genericError.message")
                }));
            });
    };

    return (
        <EmphasizedSegment padded="very">
            <Forms
                onSubmit={ onSubmitHandler }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 8 }>
                            {
                                properties?.required?.map((property: TypeProperty, index: number) => {
                                    const name = property.description.split("#")[ 0 ];
                                    const isPassword = property.attributes
                                        .find(attribute => attribute.name === "type").value === "password";
                                    const toggle = property.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
    
                                    return (
                                        isPassword
                                            ? (
                                                <Field
                                                    name={ property.name }
                                                    type="password"
                                                    key={ index }
                                                    required={ true }
                                                    disabled={ id === CONSUMER_USERSTORE_ID }
                                                    label={ name }
                                                    requiredErrorMessage={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.requiredErrorMessage",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                    }
                                                    showPassword={ t("common:showPassword") }
                                                    hidePassword={ t("common:hidePassword") }
                                                    placeholder={
                                                        t("console:manage.features.userstores.forms." +
                                                            "custom.placeholder",
                                                            {
                                                                name: property.description.split("#")[ 0 ]
                                                            })
                                                    }
                                                    data-testid={ `${ testId }-form-password-input-${ property.name }` }
                                                />
                                            )
                                            : toggle
                                                ? (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="toggle"
                                                        key={ index }
                                                        required={ false }
                                                        disabled={ id === CONSUMER_USERSTORE_ID }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        toggle
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        data-testid={ `${ testId }-form-toggle-${ property.name }` }
                                                    />
                                                ) :
                                                (
                                                    <Field
                                                        name={ property.name }
                                                        value={ property.value ?? property.defaultValue }
                                                        type="text"
                                                        key={ index }
                                                        required={ true }
                                                        disabled={ id === CONSUMER_USERSTORE_ID }
                                                        label={ property.description.split("#")[ 0 ] }
                                                        requiredErrorMessage={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.requiredErrorMessage",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        placeholder={
                                                            t("console:manage.features.userstores.forms." +
                                                                "custom.placeholder",
                                                                {
                                                                    name: property.description.split("#")[ 0 ]
                                                                })
                                                        }
                                                        data-testid={ `${ testId }-form-text-input-${ property.name }` }
                                                    />
                                                )
                                    );
                                })
                            }
    
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
    
                { (properties?.optional.sql.delete.length > 0
                    || properties?.optional.sql.insert.length > 0
                    || properties?.optional.sql.select.length > 0
                    || properties?.optional.sql.update.length > 0)
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 8 } textAlign="center">
                                <LinkButton
                                    type="button"
                                    onClick={ () => { setShowMore(!showMore); } }
                                    data-testid={ `${ testId }-show-more-button` }
                                >
                                    <Icon name={ showMore ? "chevron up" : "chevron down" } />
                                    { showMore ? t("common:showLess") : t("common:showMore") }
                                </LinkButton>
                            </Grid.Column>
                        </Grid>
                    )
                }
                { showMore && properties?.optional.nonSql.length > 0 &&
                    (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 8 }>
                                    {
                                        properties?.optional?.nonSql.map((property: TypeProperty, index: number) => {
                                            const isValuePresent = property.value !== "";
                                            const name = property.description.split("#")[ 0 ];
                                            const isPassword = property.attributes
                                                .find(attribute => attribute.name === "type").value === "password";
                                            const toggle = property.attributes
                                                .find(attribute => attribute.name === "type")?.value === "boolean";
                                            const uniqueID = property.name === "UniqueID";

                                            return (
                                                isValuePresent
                                                ? (
                                                isPassword
                                                    ? (
                                                        <Field
                                                            name={ property.name }
                                                            type="password"
                                                            key={ index }
                                                            required={ false }
                                                            disabled={ id === CONSUMER_USERSTORE_ID }
                                                            label={ name }
                                                            requiredErrorMessage={
                                                                t("console:manage.features.userstores.forms." +
                                                                    "custom.requiredErrorMessage",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            showPassword={ t("common:showPassword") }
                                                            hidePassword={ t("common:hidePassword") }
                                                            placeholder={
                                                                t("console:manage.features.userstores.forms." +
                                                                    "custom.placeholder",
                                                                    {
                                                                        name: property.description.split("#")[ 0 ]
                                                                    })
                                                            }
                                                            data-testid={ `${ testId }-form-non-sql-password-input-${
                                                                property.name }` }
                                                        />
                                                    )
                                                    : toggle
                                                        ? (
                                                            <Field
                                                                name={ property.name }
                                                                value={ property.value ?? property.defaultValue }
                                                                type="toggle"
                                                                key={ index }
                                                                required={ false }
                                                                disabled={ id === CONSUMER_USERSTORE_ID }
                                                                label={ property.description.split("#")[ 0 ] }
                                                                requiredErrorMessage={
                                                                    t("console:manage.features.userstores.forms.edit." +
                                                                        "connection.custom.requiredErrorMessage",
                                                                        {
                                                                            name: property.description.split("#")[ 0 ]
                                                                        })
                                                                }
                                                                toggle
                                                                placeholder={
                                                                    t("console:manage.features.userstores.forms." +
                                                                        "custom.placeholder",
                                                                        {
                                                                            name: property.description.split("#")[ 0 ]
                                                                        })
                                                                }
                                                                data-testid={ `${ testId }-form-non-sql-toggle-${
                                                                    property.name }` }
                                                            />
                                                        )
                                                        : uniqueID
                                                            ? (
                                                                <Field
                                                                    name={ property.name }
                                                                    hidden
                                                                    value={ property.value ?? property.defaultValue }
                                                                    type="text"
                                                                    key={ index }
                                                                    required={ false }
                                                                    disabled={ id === CONSUMER_USERSTORE_ID }
                                                                    label={ property.description.split("#")[ 0 ] }
                                                                    requiredErrorMessage={
                                                                        t("console:manage.features.userstores.forms.edit." +
                                                                            "connection.custom.requiredErrorMessage",
                                                                            {
                                                                                name: property.description.split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    placeholder={
                                                                        t("console:manage.features.userstores.forms." +
                                                                            "custom.placeholder",
                                                                            {
                                                                                name: property.description.split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    data-testid={ `${ testId }-form-non-sql-text-input-${
                                                                        property.name }` }
                                                                />
                                                            )
                                                            : (
                                                                <Field
                                                                    name={ property.name }
                                                                    value={ property.value ?? property.defaultValue }
                                                                    type="text"
                                                                    key={ index }
                                                                    required={ false }
                                                                    disabled={ id === CONSUMER_USERSTORE_ID }
                                                                    label={ property.description.split("#")[ 0 ] }
                                                                    requiredErrorMessage={
                                                                        t("console:manage.features.userstores.forms.edit." +
                                                                            "connection.custom.requiredErrorMessage",
                                                                            {
                                                                                name: property.description.split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    placeholder={
                                                                        t("console:manage.features.userstores.forms." +
                                                                            "custom.placeholder",
                                                                            {
                                                                                name: property.description.split("#")[ 0 ]
                                                                            })
                                                                    }
                                                                    data-testid={ `${ testId }-form-non-sql-text-input-${
                                                                        property.name }` }
                                                                />
                                                            )
                                                )
                                                : (
                                                    <></>
                                                )
                                            );
                                        })
                                    }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )
                }
                { showMore
                    && (id !== CONSUMER_USERSTORE_ID)
                    && (properties?.optional.sql.delete.length > 0
                        || properties?.optional.sql.insert.length > 0
                        || properties?.optional.sql.select.length > 0
                        || properties?.optional.sql.update.length > 0)
                    && (
                        <Grid columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <SqlEditor
                                    onChange={ (name: string, value: string) => {
                                        const tempSql = new Map(sql);
                                        tempSql.set(name, value);
                                        setSql(tempSql);
                                    } }
                                    properties={ properties?.optional.sql }
                                    values={ sql }
                                    data-testid={ `${ testId }-sql-editor` }
                                />
                            </Grid.Column>
                        </Grid>
                    )
                }
                <Grid columns={ 1 }>
                    <Grid.Column width={ 8 }>
                        <PrimaryButton type="submit" data-testid={ `${ testId }-form-submit-button` }>
                            Update
                        </PrimaryButton>
                    </Grid.Column>
                </Grid>
            </Forms>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditUserDetails.defaultProps = {
    "data-testid": "userstore-user-details-edit"
};
