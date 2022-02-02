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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import { GenericIcon } from "@wso2is/react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Grid, Icon, List, ModalContent, Popup } from "semantic-ui-react";
import { deleteDevice, getMetaData, startFidoFlow, startFidoUsernamelessFlow, updateDeviceName } from "../../../api";
import { getMFAIcons } from "../../../configs";
import { CommonConstants } from "../../../constants";
import { AlertInterface, AlertLevels } from "../../../models";
import { FIDODevice } from "../../../models/fido-authenticator";
import { AppState } from "../../../store";
import { setActiveForm } from "../../../store/actions";
import { EditSection, ModalComponent } from "../../shared";

/**
 * FIDO key.
 *
 * @constant
 * @default
 * @type {string}
 */
const FIDO = "fido-";

/**
 * Prop types for the associated accounts component.
 * Also see {@link FIDOAuthenticator.defaultProps}
 */
interface FIDOAuthenticatorProps extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * FIDO section.
 *
 * @return {JSX.Element}
 */
export const FIDOAuthenticator: React.FunctionComponent<FIDOAuthenticatorProps> = (
    props: FIDOAuthenticatorProps
): JSX.Element => {

    const { onAlertFired, ["data-testid"]: testId } = props;
    const { t } = useTranslation();
    const [deviceList, setDeviceList] = useState<FIDODevice[]>([]);
    const [isDeviceErrorModalVisible, setDeviceErrorModalVisibility] = useState(false);
    const [isDeviceSuccessModalVisible, setIsDeviceSuccessModalVisibility] = useState(false);
    const [recentFIDOName, setRecentFIDOName] = useState("");
    const [recentFIDONameError, setRecentFIDONameError] = useState(false);
    const [recentlyAddedDevice, setRecentlyAddedDevice] = useState<string>();
    const [editFIDO, setEditFido] = useState<Map<string, boolean>>();

    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);
    const dispatch = useDispatch();

    /**
     * This function fires a notification on failure.
     */
    const fireFailureNotification = () => {
        onAlertFired({
            description: t(
                "myAccount:components.mfa.fido.notifications.startFidoFlow.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: t(
                "myAccount:components.mfa.fido.notifications.startFidoFlow.genericError.message"
            )
        });
    };

    const getFidoMetaData = () => {
        let devices: FIDODevice[] = [];
        getMetaData()
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.length > 0) {
                        devices = [...response.data];
                    }
                    setDeviceList(devices);
                }
            })
            .catch(() => {
                fireFailureNotification();
            });
    };

    useEffect(() => {
        getFidoMetaData();
    }, []);

    /**
     * This calls `getFidoMetaData` every time a new device is registered
     */
    useEffect(() => {
        if (!_.isEmpty(recentlyAddedDevice)) {
            getFidoMetaData();
        }
    }, [recentlyAddedDevice]);

    /**
     * This function fires a notification on successful removal of a device.
     */
    const fireDeletionSuccessNotification = () => {
        onAlertFired({
            description: t(
                "myAccount:components.mfa.fido.notifications.removeDevice.success.description"
            ),
            level: AlertLevels.SUCCESS,
            message: t(
                "myAccount:components.mfa.fido.notifications.removeDevice.success.message"
            )
        });
    };

    /**
     * This function fires a notification when removal of a device fails.
     */
    const fireDeletionFailureNotification = (error: string) => {
        onAlertFired({
            description: t(
                "myAccount:components.mfa.fido.notifications.removeDevice.error.description",
                {
                    description: error
                }
            ),
            level: AlertLevels.ERROR,
            message: t(
                "myAccount:components.mfa.fido.notifications.removeDevice.error.message"
            )
        });
    };

    /**
     * This function fires a notification on the success of device name update.
     */
    const fireDeviceNameUpdateSuccessNotification = () => {
        onAlertFired({
            description: t(
                "myAccount:components.mfa.fido.notifications.updateDeviceName.success.description"
            ),
            level: AlertLevels.SUCCESS,
            message: t(
                "myAccount:components.mfa.fido.notifications.updateDeviceName.success.message"
            )
        });
    };

    /**
     * This function fires a notification on device name update failure.
     */
    const fireDeviceNameUpdateFailureNotification = (error: string) => {
        onAlertFired({
            description: t(
                "myAccount:components.mfa.fido.notifications.updateDeviceName.genericError.description",
                {
                    description: error
                }
            ),
            level: AlertLevels.ERROR,
            message: t(
                "myAccount:components.mfa.fido.notifications.updateDeviceName.error.message"
            )
        });
    };

    /**
     * This handles the initiation of device registration with
     * passwordless authentication
     */
    const addDevice = () => {
        setDeviceErrorModalVisibility(false);
        startFidoFlow()
            .then(({ data }) => {
                setRecentlyAddedDevice(data.credential.id);
                setIsDeviceSuccessModalVisibility(true);
            }).catch(() => {
                fireFailureNotification();
            });
    };

    /**
     * This handles the initiation of device registration with
     * usernameless authentication
     */
    const addUsernamelessDevice = () => {
        setDeviceErrorModalVisibility(false);
        startFidoUsernamelessFlow()
            .then(({ data }) => {
                setRecentlyAddedDevice(data.credential.id);
                setIsDeviceSuccessModalVisibility(true);
            }).catch(() => {
                setDeviceErrorModalVisibility(true);
            });
    };

    /**
     * Closes the edit form of the concerned FIDO device.
     * @param id
     */
    const cancelEdit = (id: string) => {
        const tempEditFido: Map<string, boolean> = new Map(editFIDO);
        tempEditFido.set(id, false);
        setEditFido(tempEditFido);
        dispatch(setActiveForm(null));
    };

    const removeDevice = (id: string) => {
        deleteDevice(id)
            .then(() => {
                cancelEdit(id);
                getFidoMetaData();
                fireDeletionSuccessNotification();
            }).catch((error) => {
                fireDeletionFailureNotification(error);
            });
    };

    /**
     * Handles the device successful registration modal close action
     */
    const handleDeviceSuccessModalClose = (): void => {
        setRecentlyAddedDevice("");
        setIsDeviceSuccessModalVisibility(false);
    };

    /**
     * This function posts the name of the FIDO device
     */
    const submitName = (name: string, id: string): void => {
        if (!_.isEmpty(recentFIDOName) || _.isEmpty(recentlyAddedDevice)) {
            setRecentlyAddedDevice("");
            setRecentFIDOName("");
            setRecentFIDONameError(false);

            updateDeviceName(id, name)
                .then(() => {
                    getFidoMetaData();
                    handleDeviceSuccessModalClose();
                    cancelEdit(id);
                    fireDeviceNameUpdateSuccessNotification();
                })
                .catch(((error) => {
                    fireDeviceNameUpdateFailureNotification(error);
                }));
        } else {
            setRecentFIDONameError(true);
        }
    };

    /**
     * This is the `onChange` handler of the device-name textbox that is displayed
     * in the modal following successful registration of a device.
     * @param event
     */
    const handleDeviceNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRecentFIDOName(event.target.value);
    };

    /**
     * Handles the device registration error modal close action.
     */
    const handleDeviceErrorModalClose = (): void => {
        setRecentlyAddedDevice("");
        setIsDeviceSuccessModalVisibility(false);
        setDeviceErrorModalVisibility(false);
    };

    /**
     * Shows the edit form for the clicked FIDO device
     * @param id
     */
    const showEdit = (id: string) => {
        const tempEditFido: Map<string, boolean> = new Map(editFIDO);
        tempEditFido.set(id, true);
        setEditFido(tempEditFido);
        dispatch(setActiveForm(CommonConstants.SECURITY + FIDO + id));
    };

    /**
     * Device registration error modal.
     *
     * @return {JSX.Element}
     */
    const deviceErrorModal = (): JSX.Element => {
        return (
            <ModalComponent
                data-testid={ `${testId}-error-modal-component` }
                primaryAction={ t("common:retry") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleDeviceErrorModalClose }
                onPrimaryActionClick={ addUsernamelessDevice }
                open={ isDeviceErrorModalVisible }
                onClose={ handleDeviceErrorModalClose }
                type="negative"
                header={ t("myAccount:components.mfa.fido.modals.deviceRegistrationErrorModal.heading") }
                content={ t("myAccount:components.mfa.fido.modals.deviceRegistrationErrorModal.description") }
            >
                <ModalContent>
                    <Button
                        className="negative-modal-link-button"
                        onClick={ addDevice }
                    >
                        { t("myAccount:components.mfa.fido.tryButton") }
                    </Button>
                </ModalContent>
            </ModalComponent>
        );
    };

    /**
     * This modal is called soon after a device is successfully registered.
     */
    const deviceRegistrationSuccessModal = (): JSX.Element => {
        return (
            <ModalComponent
                data-testid={ `${testId}-success-modal-component` }
                primaryAction={ t("common:save") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleDeviceSuccessModalClose }
                onPrimaryActionClick={ () => {
                    submitName(recentFIDOName, recentlyAddedDevice);
                } }
                open={ isDeviceSuccessModalVisible }
                onClose={ handleDeviceSuccessModalClose }
                type="positive"
                header={ t("myAccount:components.mfa.fido.notifications.startFidoFlow.success.message") }
                content={ t("myAccount:components.mfa.fido.notifications.startFidoFlow.success.description") }
            >
                <ModalContent>
                    <Form>
                        <Form.Field>
                            <Form.Input
                                autoFocus={ true }
                                type="text"
                                label=""
                                placeholder={
                                    t("myAccount:components" +
                                        ".mfa.fido.form.placeholder")
                                }
                                onChange={ handleDeviceNameChange }
                                error={
                                    recentFIDONameError
                                        ? {
                                            content: t("myAccount:components.mfa.fido.form.required"),
                                            pointing: "above"
                                        }
                                        : false
                                }
                            />
                        </Form.Field>
                    </Form>
                </ModalContent>
            </ModalComponent>
        );
    };

    return (
        <>
            <div>
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <GenericIcon
                                    icon={ getMFAIcons().fingerprint }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{ t("myAccount:components.mfa.fido.heading") }</List.Header>
                                <List.Description>
                                    { t("myAccount:components.mfa.fido.description") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                <Icon
                                    floated="right"
                                    link={ true }
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="add"
                                    onClick={ addUsernamelessDevice }
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {
                    deviceList ? (
                        <List
                            data-testid={ `${testId}-devices-list` }
                            divided={ true }
                            verticalAlign="middle"
                            className="main-content-inner settings-section-inner-list"
                        >
                            {
                                deviceList.map((device, index) => (
                                    editFIDO?.get(device.credential.credentialId)
                                        && activeForm?.startsWith(CommonConstants.SECURITY+FIDO)
                                        ? (
                                            <EditSection key={ device.credential.credentialId }
                                                         data-testid={ `${testId}-device-${index}-edit-section` }>
                                                <Grid>
                                                    <Grid.Row columns={ 2 }>
                                                        <Grid.Column width={ 4 }>
                                                            {
                                                                t("myAccount:components.mfa.fido.form.label")
                                                                + ` ${index + 1}`
                                                            }
                                                        </Grid.Column>
                                                        <Grid.Column width={ 12 }>
                                                            <List.Item>
                                                                <List.Content>
                                                                    <Forms
                                                                        onSubmit={
                                                                            (values: Map<string, string>) => {
                                                                                submitName(
                                                                                    values.get(
                                                                                        device.credential.credentialId
                                                                                    ),
                                                                                    device.credential.credentialId
                                                                                );
                                                                            }
                                                                        }
                                                                    >
                                                                        <Field
                                                                            autoFocus={ true }
                                                                            label=""
                                                                            value={ device.displayName || "" }
                                                                            required={ true }
                                                                            requiredErrorMessage={
                                                                                t("myAccount:components" +
                                                                                    ".mfa.fido.form.required")
                                                                            }
                                                                            name={ device.credential.credentialId }
                                                                            placeholder={
                                                                                t("myAccount:components" +
                                                                                    ".mfa.fido.form.placeholder")
                                                                            }
                                                                            type="text"
                                                                        />
                                                                        <Field
                                                                            hidden={ true }
                                                                            type="divider"
                                                                        />
                                                                        <Form.Group inline={ true }>
                                                                            <Field
                                                                                size="small"
                                                                                type="submit"
                                                                                value={ t("common:update").toString() }
                                                                            />
                                                                            <Field
                                                                                className="link-button"
                                                                                onClick={
                                                                                    () => {
                                                                                        cancelEdit(
                                                                                            device.credential
                                                                                                .credentialId
                                                                                        );
                                                                                    }
                                                                                }
                                                                                size="small"
                                                                                type="button"
                                                                                value={ t("common:cancel").toString() }
                                                                            />
                                                                        </Form.Group>
                                                                    </Forms>
                                                                </List.Content>
                                                            </List.Item>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </EditSection>
                                        )
                                        : (
                                            <List.Item className="inner-list-item" key={ index }
                                                       data-testid={ `${testId}-devices-list-item` }>
                                                <Grid padded={ true }>
                                                    <Grid.Row columns={ 2 } className="first-column">
                                                        <Grid.Column width={ 11 }>
                                                            <List.Header className="with-left-padding">
                                                                <Icon
                                                                    floated="right"
                                                                    className="list-icon"
                                                                    size="small"
                                                                    color="grey"
                                                                    name="dot circle outline"
                                                                />
                                                                {
                                                                    device.displayName
                                                                    || t("myAccount:components.mfa.fido.form.label")
                                                                    + ` ${index + 1}`
                                                                }
                                                            </List.Header>
                                                        </Grid.Column>
                                                        <Grid.Column width={ 5 } className="last-column">
                                                            <List.Content floated="right">
                                                                <Icon
                                                                    id={ device.credential.credentialId }
                                                                    link={ true }
                                                                    className="list-icon"
                                                                    size="large"
                                                                    color="grey"
                                                                    name="pencil alternate"
                                                                    onClick={
                                                                        () => {
                                                                            showEdit(device.credential.credentialId);
                                                                        }
                                                                    }
                                                                />
                                                                <Popup
                                                                    content={
                                                                        t("myAccount:components.mfa.fido.form.remove")
                                                                    }
                                                                    inverted
                                                                    trigger={ (
                                                                        <Icon
                                                                            link={ true }
                                                                            name="trash alternate outline"
                                                                            color="red"
                                                                            size="small"
                                                                            className="list-icon"
                                                                            onClick={
                                                                                () => {
                                                                                    removeDevice(
                                                                                        device.credential
                                                                                            .credentialId
                                                                                    );
                                                                                }
                                                                            }
                                                                        />
                                                                    ) }
                                                                />
                                                            </List.Content>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </List.Item>
                                        )
                                ))
                            }
                        </List>
                    )
                        :
                        (
                            <>
                                <p style={ { fontSize: "12px" } }>
                                    <Icon
                                        color="grey"
                                        floated="left"
                                        name="info circle"
                                    />
                                    You don&apos;t have any devices registered yet.
                            </p>
                            </>
                        )
                }
            </div>
            <>{ deviceErrorModal() }</>
            <>{ deviceRegistrationSuccessModal() }</>
        </>
    );
};

/**
 * Default properties of {@link FIDOAuthenticator}
 * See type definitions in {@link FIDOAuthenticatorProps}
 */
FIDOAuthenticator.defaultProps = {
    "data-testid": "fido-authenticator"
};
