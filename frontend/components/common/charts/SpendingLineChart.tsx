// A smooht line char that hsows spending over time.
// How it works:-
// parent passes labesl (x-axis) and calues in the y- axis
// this componte srender the card using  react-native-charts-kit.
// so why a separte componte
// chart rendering is complez - colors, gradients, spacing..
// it lets the analytiscs screen focus on the data  not the presentation
// it lets the analystics screen calculate what to show not the chart
import { View, Text, StyleSheet, Dimensions } from "react-native";
import useTheme from "../../../hooks/useTheme";
import { LineChart } from 'react-native-chart-kit';

// Screen width
const SCREEN_WIDTH = Dimensions.get('window').width;

// props
interface SpendingLineChartProps {
    labels: string[];    // x-axis labels like ["Jun", "Jul", "Aug"]
    values: number[];    // data points like [500, 300, 800]
}

export default function SpendingLineChart({ labels, values }: SpendingLineChartProps) {
    const colors = useTheme();
    const styles = createStyles(colors);
    // empty state
    if (values.length === 0 || values.every((v) => v === 0)) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No spending data available</Text>
                <Text style={styles.emptySubtext}>Start by adding a transaction!</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{ data: values }],
                }}
                width={SCREEN_WIDTH - 55}
                height={210}
                yAxisLabel="ETB"
                yAxisSuffix=""
                withDots={true}              // show dots on data points
                withInnerLines={false}       // hide horizontal grid lines
                withOuterLines={false}       // hide the outer border
                withVerticalLines={false}    // hide vertical grid lines
                withHorizontalLabels={true}  // show y-axis labels
                fromZero={true}              // y-axis starts at 0
                bezier                       // smooth curved line (not jagged
                chartConfig={{
                    // BACKGROUND
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    // LINE + DOTS
                    color: () => colors.champagne,           // line color (gold)
                    // FILL UNDER THE LINE
                    fillShadowGradientFrom: colors.champagne,
                    fillShadowGradientFromOpacity: 0.3,      // semi-transparent
                    fillShadowGradientTo: colors.champagne,
                    fillShadowGradientToOpacity: 0.0,        // fades to invisible
                    // LABELS (text on axes)
                    labelColor: () => colors.textSecondary,                    // no decimals on y-axis
                    propsForLabels: {
                        fontSize: 11,
                        fontWeight: '500',
                    },
                    // DECORATION
                    propsForDots: {
                        r: '4',                               // dot radius
                        strokeWidth: '2',
                        stroke: colors.champagne,
                    },
                }}
                style={styles.chart}
            />
        </View>
    );
}
// styles
const createStyles = (colors: ReturnType<typeof useTheme>) => StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    chart: {
        borderRadius: 12,
    },
    emptyContainer: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 32,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    emptySubtext: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
})
