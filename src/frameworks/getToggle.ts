import { AppConfigurationClient } from '@azure/app-configuration';

import { Toggle } from '../contracts/Toggle';
import { ParsedSetting } from '../contracts/ParsedSetting';

import { config } from '../config/config';

/**
 * Helper that will get a single toggle, check its validity to the user's group and send back a nicer toggle object
 *
 * @param userGroup The user's group which will be used to match any toggles
 */
export async function getToggle(userGroup?: string): Promise<Toggle | undefined> {
  const { connectionString, toggleName, toggleLabel, fallbackUserGroup } = config;
  const client = new AppConfigurationClient(connectionString);

  // Get single toggle from App Configuration
  const parsedSetting = await loadToggle(client, { toggleName, toggleLabel });

  // Get user's matched group
  const group = getMatchedUserGroup(parsedSetting, userGroup, fallbackUserGroup);

  // Bail out if no match
  if (!group || group.length === 0) return undefined;

  // Get some nicer names
  const { id, description, enabled } = parsedSetting;
  const rolloutPercentage = group.RolloutPercentage;

  // So, finally... is this specific toggle active for the current user?
  const isActiveForCurrentUser = checkIfToggleIsActiveForCurrentUser(rolloutPercentage);

  return {
    id,
    description,
    enabled,
    rolloutPercentage,
    isActiveForCurrentUser
  };
}

async function loadToggle(
  client: AppConfigurationClient,
  toggle: Record<string, string>
): Promise<ParsedSetting> {
  const retrievedSetting: any = await client.getConfigurationSetting({
    key: toggle.toggleName,
    label: toggle.toggleLabel
  });

  return JSON.parse(retrievedSetting.value);
}

function getMatchedUserGroup(
  parsedSetting: any,
  userGroup: string | undefined,
  fallbackUserGroup: string
) {
  if (!userGroup) userGroup = fallbackUserGroup;

  const groups = parsedSetting.conditions.client_filters[0].parameters.Audience.Groups;
  const group = groups.find((group: Record<string, unknown>) => group.Name === userGroup);
  return group;
}

function checkIfToggleIsActiveForCurrentUser(rolloutPercentage: number) {
  if (!rolloutPercentage)
    throw new Error('Missing rolloutPercentage in checkIfToggleIsActiveForCurrentUser()!');

  if (rolloutPercentage === 0) return false;
  if (rolloutPercentage === 100) return true;

  const RANDOM_CHANCE = Math.round(Math.random() * 100);
  if (RANDOM_CHANCE >= rolloutPercentage) return true;

  return false;
}
