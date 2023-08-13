import { settings as settingsDef } from "@index";
import { Tables } from "@metro/common";
import { getAssetIDByName } from "@utils/assets";

const { ScrollView } = ReactNative;
const { Stack, TableRow, TableSwitchRow, TableRowGroup } = Tables;

export default function General() {
    const settings = settingsDef.useStorage();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
            <Stack style={{ paddingVertical: 24, paddingHorizontal: 12 }} spacing={24}>
                <TableRowGroup title="Settings">
                    <TableSwitchRow
                        label="Enable Discord's experiments menu"
                        subLabel="Enables the experiments menu in Discord's settings, which only staff has access to."
                        icon={<TableRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                        value={settings.experiments}
                        onValueChange={(v: boolean) => settings.experiments = v}
                    />
                    <TableSwitchRow
                        label="Hide gift button on chat input"
                        subLabel="Hides the gift button on the chat input."
                        icon={<TableRow.Icon source={getAssetIDByName("ic_gift_24px")} />}
                        value={settings.hideGiftButton}
                        onValueChange={(v: boolean) => settings.hideGiftButton = v}
                    />
                    <TableSwitchRow
                        label="Hide idle status"
                        subLabel="Hides the idling status when app is backgrounded."
                        icon={<TableRow.Icon source={getAssetIDByName("StatusIdle")} />}
                        value={settings.hideIdling}
                        onValueChange={(v: boolean) => settings.hideIdling = v}
                    />
                </TableRowGroup>
            </Stack>
        </ScrollView>
    );
}
