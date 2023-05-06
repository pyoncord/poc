/**
 * Lazily navigate to a custom screen
 * @param navigation The navigation object from useNavigation
 * @param renderPromise Promise that resolves to the component to render (e.g. import("../ui/screens/General"))
 * @param screenOptions Screen options to pass to the navigation object
 * @param props Props to pass to the component
 * 
 * @example 
 * const navigation = NavigationNative.useNavigation();
 * ...
 * lazyNavigate(navigation, import("../ui/screens/General"), "General")
 */
export default async function lazyNavigate(
    navigation: any,
    renderPromise: Promise<any>,
    screenOptions: string | Record<string, any>,
    props?: any,
) {
    const React = await import("../metro/common").then(m => m.React);
    const Component = await renderPromise.then(m => m.default);

    if (typeof screenOptions === "string") {
        screenOptions = { title: screenOptions };
    }

    navigation.navigate("PyoncordCustomPage", {
        ...screenOptions,
        render: () => <Component {...props} />
    })
}