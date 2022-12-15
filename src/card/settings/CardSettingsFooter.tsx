import React, { useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { FormControlLabel, FormGroup, IconButton, Switch, Tooltip } from '@material-ui/core';
import NeoSetting from '../../component/field/Setting';
import {
  NeoCustomReportStyleModal,
  RULE_BASED_REPORT_CUSTOMIZATIONS,
} from '../../extensions/styling/StyleRuleCreationModal';
import TuneIcon from '@material-ui/icons/Tune';
import { getReportTypes } from '../../extensions/ExtensionUtils';

import {
  NeoCustomReportActionsModal,
  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS,
} from '../../extensions/actions/ActionsRuleCreationModal';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StarsIcon from '@material-ui/icons/Stars';

const update = (state, mutations) => Object.assign({}, state, mutations);

const NeoCardSettingsFooter = ({
  type,
  fields,
  reportSettings,
  reportSettingsOpen,
  extensions,
  onToggleReportSettings,
  onReportSettingUpdate,
}) => {
  const [reportSettingsText, setReportSettingsText] = React.useState(reportSettings);

  // Variables related to customizing report settings
  const [customReportStyleModalOpen, setCustomReportStyleModalOpen] = React.useState(false);

  const settingToCustomize = 'styleRules';

  // Variables related to customizing report actions
  const [customReportActionsModalOpen, setCustomReportActionsModalOpen] = React.useState(false);
  const actionsToCustomize = 'actionsRules';

  const debouncedReportSettingUpdate = useCallback(debounce(onReportSettingUpdate, 250), []);

  const updateSpecificReportSetting = (field: string, value: any) => {
    const entry = {};
    entry[field] = value;
    setReportSettingsText(update(reportSettingsText, entry));
    debouncedReportSettingUpdate(field, value);
  };

  const reportTypes = getReportTypes(extensions);

  // Contains, for a certain type of chart, its disabling logic
  const disabledDependency = reportTypes[type] && reportTypes[type].disabledDependency;

  /* This method manages the disabling logic for all the settings inside the footer.
   *  The logic is based on the disabledDependency param inside the chart's configuration */
  const getDisabled = (field: string) => {
    // By default an option is enabled
    let isDisabled = false;
    let dependencyLogic = disabledDependency[field];
    if (dependencyLogic != undefined) {
      // Getting the current parameter defined in the settings of the report
      // (if undefined, the param will be treated as undefined (boolean false)
      isDisabled = reportSettingsText[dependencyLogic.dependsOn];
      if (!dependencyLogic.operator) {
        isDisabled = !isDisabled;
      }
    }
    return isDisabled;
  };
  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    setReportSettingsText(reportSettings);
  }, [JSON.stringify(reportSettings)]);

  const settings = reportTypes[type] ? reportTypes[type].settings : {};

  // If there are no advanced settings, render nothing.
  if (Object.keys(settings).length == 0) {
    return <div></div>;
  }

  // Else, build the advanced settings view.
  const advancedReportSettings = (
    <div style={{ marginLeft: '5px' }}>
      {Object.keys(settings).map((setting) => {
        let isDisabled = false;
        // Adding disabling logic to specific entries but only if the logic is defined inside the configuration
        if (disabledDependency != undefined) {
          isDisabled = getDisabled(setting);
        }

        return (
          <NeoSetting
            key={setting}
            name={setting}
            value={reportSettingsText[setting]}
            type={settings[setting].type}
            label={settings[setting].label}
            defaultValue={settings[setting].default}
            choices={settings[setting].values}
            disabled={isDisabled}
            onChange={(e) => updateSpecificReportSetting(setting, e)}
          />
        );
      })}
    </div>
  );

  // TODO - Make the extensions more pluggable and dynamic, instead of hardcoded here.
  return (
    <div>
      {extensions.styling ? (
        <NeoCustomReportStyleModal
          settingName={settingToCustomize}
          settingValue={reportSettings[settingToCustomize]}
          type={type}
          fields={fields}
          customReportStyleModalOpen={customReportStyleModalOpen}
          setCustomReportStyleModalOpen={setCustomReportStyleModalOpen}
          onReportSettingUpdate={onReportSettingUpdate}
        ></NeoCustomReportStyleModal>
      ) : (
        <></>
      )}

      {extensions.actions ? (
        <NeoCustomReportActionsModal
          settingName={actionsToCustomize}
          settingValue={reportSettings[actionsToCustomize]}
          type={type}
          fields={fields}
          customReportActionsModalOpen={customReportActionsModalOpen}
          setCustomReportActionsModalOpen={setCustomReportActionsModalOpen}
          onReportSettingUpdate={onReportSettingUpdate}
        ></NeoCustomReportActionsModal>
      ) : (
        <></>
      )}

      <table
        style={{
          borderTop: '1px dashed lightgrey',
          background: reportSettingsOpen ? '#f6f6f6' : 'inherit',
          width: '100%',
        }}
      >
        <tbody>
          <tr>
            <td>
              <FormGroup>
                <FormControlLabel
                  style={{ marginLeft: '5px', marginBottom: '10px' }}
                  control={<Switch checked={reportSettingsOpen} onChange={onToggleReportSettings} color='default' />}
                  labelPlacement='end'
                  label={<div style={{ fontSize: '12px', color: 'grey' }}>Advanced settings</div>}
                />
              </FormGroup>
            </td>
            {RULE_BASED_REPORT_CUSTOMIZATIONS[type] && extensions.styling ? (
              <td>
                <Tooltip title='Set rule-based styling' aria-label=''>
                  <IconButton
                    size='small'
                    style={{ float: 'right', marginRight: '10px' }}
                    aria-label='custom styling'
                    onClick={() => {
                      setCustomReportStyleModalOpen(true); // Open the modal.
                    }}
                  >
                    <TuneIcon></TuneIcon>
                  </IconButton>
                </Tooltip>
              </td>
            ) : (
              <></>
            )}
            {extensions.actions && RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type] ? (
              <td>
                <Tooltip title='Set report actions' aria-label=''>
                  <IconButton
                    size='small'
                    style={{ float: 'right', marginRight: '10px' }}
                    aria-label='custom actions'
                    onClick={() => {
                      setCustomReportActionsModalOpen(true); // Open the modal.
                    }}
                  >
                    <StarsIcon></StarsIcon>
                  </IconButton>
                </Tooltip>
              </td>
            ) : (
              <></>
            )}
          </tr>
          <tr>
            <td colSpan={2} style={{ maxWidth: '100%' }}>
              {reportSettingsOpen ? advancedReportSettings : <div></div>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NeoCardSettingsFooter;
