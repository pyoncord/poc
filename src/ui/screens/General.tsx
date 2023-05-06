import { Forms, React, ReactNative } from "../../metro/common";

const { ScrollView } = ReactNative;
const { FormRow } = Forms;

export default function General() {
    return (
        <ScrollView>
            <FormRow
                label="General"
                trailing={FormRow.Arrow}
                onPress={() => {
                    console.log("General")
                }}
            />
        </ScrollView>
    )
}