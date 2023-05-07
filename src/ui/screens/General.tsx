import { Forms } from "../../metro/common";
import { getAssetIDByName } from "../../utils/assets";

const { ScrollView } = ReactNative;
const { FormSection, FormRow, FormSwitchRow } = Forms;

export default function General() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
            <FormSection title="Settings" titleStyleType="no_border">
                <FormSwitchRow
                    label="Trigger Discord's experiments menu"
                    subLabel="Enables the experiments menu in Discord's settings, which only staff has access to."
                    leading={<FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                    value={true}
                    onValueChange={() => void 0}
                />
            </FormSection>
        </ScrollView>
    )
}