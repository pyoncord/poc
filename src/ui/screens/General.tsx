import { settings as settingsDef } from "@index";
import { Tables } from "@metro/common";
import { resolveAssets } from "@utils/assets";

const { ScrollView } = ReactNative;
const { Stack, TableRow, TableSwitchRow, TableRowGroup } = Tables;

const icons = resolveAssets({
    StaffBadge: {
        path: "/assets/images/native/badge",
        name: "ic_badge_staff"
    },
    Gift: {
        path: "/assets/images/native/icons/settings",
        name: "ic_gift_24px"
    },
    Idle: {
        path: "/assets/images/native/status",
        name: "StatusIdle"
    }
});


export default function General() {
    const settings = settingsDef.useStorage();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
            <Stack style={{ paddingVertical: 24, paddingHorizontal: 12 }} spacing={24}>
                <TableRowGroup title="Settings">
                    <TableSwitchRow
                        label="Enable Discord's experiments menu"
                        subLabel="Enables the experiments menu in Discord's settings, which only staff has access to."
                        icon={<TableRow.Icon source={icons.StaffBadge} />}
                        value={settings.experiments}
                        onValueChange={(v: boolean) => settings.experiments = v}
                    />
                    <TableSwitchRow
                        label="Hide gift button on chat input"
                        subLabel="Hides the gift button on the chat input."
                        icon={<TableRow.Icon source={icons.Gift} />}
                        value={settings.hideGiftButton}
                        onValueChange={(v: boolean) => settings.hideGiftButton = v}
                    />
                    <TableSwitchRow
                        label="Hide idle status"
                        subLabel="Hides the idling status when app is backgrounded."
                        icon={<TableRow.Icon source={icons.Idle} />}
                        value={settings.hideIdling}
                        onValueChange={(v: boolean) => settings.hideIdling = v}
                    />
                </TableRowGroup>
            </Stack>
        </ScrollView>
    );
}
