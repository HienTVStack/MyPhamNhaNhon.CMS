import { Provider } from "react-redux";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/chart/BaseOptionChart";
import store from "src/redux/store";

// ----------------------------------------------------------------------

export default function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <ScrollToTop />
                <BaseOptionChartStyle />
                <Router />
            </ThemeProvider>
        </Provider>
    );
}
