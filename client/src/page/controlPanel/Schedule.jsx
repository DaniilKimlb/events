import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Label,
    ResponsiveContainer,
} from 'recharts'
import { toDate } from '../../utility/toDate'
export default function Schedule({ data }) {
    const theme = useTheme()
    const dataOrder = []
    data?.forEach((e) => {
        dataOrder.push({ time: toDate(e.date), amount: e.price })
    })
    return (
        <>
            <ResponsiveContainer>
                <LineChart
                    data={dataOrder}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="time"
                        stroke={theme.palette.text.secondary}
                    />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                            }}
                        >
                            Продажи(₸)
                        </Label>
                    </YAxis>
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
