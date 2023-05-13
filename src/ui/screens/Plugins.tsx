import { commonStyles } from "./common";

const { View, Text, ScrollView } = ReactNative;

export default function UpdaterPage() {
    return (<ScrollView style={commonStyles.container}>
        <View style={commonStyles.emptyPageImage}>
            <Text style={commonStyles.emptyPageText}>
                {"Plugin system coming soon (never)."}
            </Text>
        </View>
    </ScrollView>);
}
